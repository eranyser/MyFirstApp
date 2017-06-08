import os,sys,subprocess,smtplib,re,json
from datetime import datetime
import mimetypes
from email.mime.multipart import MIMEMultipart
from email import encoders
from email.mime.audio import MIMEAudio
from email.mime.base import MIMEBase
from email.mime.image import MIMEImage
from email.mime.text import MIMEText

def send_mail(emailfrom='freeze', emailto='', emailcc='', subject=None, mesage='', attach=[], domain='@algotec.co.il'):
    """
    :param emailfrom:   - sender freeze by default
    :param emailto:     - mail list created from cfg file
    :param subject:     - mail subject
    :param mesage:      - body message
    :param attach:      - files attach
    :param domain:      - @algotec.co.il by default
    :return err:        - return error, exception of sendmail or 0 if not
    """

    emailto_list = []
    for u in emailto.split(','):
        if u == '' or u == ',':
            continue
        emailto_list.append('{}{}'.format(u.split('@')[0], domain))
    emailto_list = list(set(emailto_list))
    emailto = ','.join(emailto_list)
    join_mail = emailto_list

    if emailcc:
        emailcc_list = []
        for u in emailcc.split(','):
            if u == '' or u == ',':
                continue
            emailcc_list.append('{}{}'.format(u.split('@')[0], domain))
        emailcc_list = list(set(emailcc_list))
        emailcc = ','.join(emailcc_list)
        join_mail += emailcc_list

    emailfrom = '{}{}'.format(emailfrom, domain)

    msg = MIMEMultipart()
    msg["From"] = emailfrom
    msg["To"] = emailto
    if emailcc:
        msg["CC"] = emailcc
    if re.match('(ci_alert).*', emailfrom):
        msg['X-Priority'] = '2'
    msg["Subject"] = subject
    mesage = '{}\n\nThis is an automatically generated email'.format(mesage)
    html = """
    <html>
    <body>
    <pre style="font: monospace">
    {}
    </pre>
    </body>
    </html>
    """.format(mesage)

    foo = MIMEText(html, 'html')
    msg.attach(foo)

    if attach:
        for f in attach:
            ctype, encoding = mimetypes.guess_type(f)
            if ctype is None or encoding is not None:
                ctype = "application/octet-stream"

            maintype, subtype = ctype.split("/", 1)

            if maintype == "text":
                try:
                    fp = open(f)
                except IOError, e:
                    print "Error: %s" % e
                    continue
                # Note: we should handle calculating the charset
                attachment = MIMEText(fp.read(), _subtype=subtype)
                fp.close()
            elif maintype == "image":
                fp = open(f, "rb")
                attachment = MIMEImage(fp.read(), _subtype=subtype)
                fp.close()
            elif maintype == "audio":
                fp = open(f, "rb")
                attachment = MIMEAudio(fp.read(), _subtype=subtype)
                fp.close()
            else:
                fp = open(f, "rb")
                attachment = MIMEBase(maintype, subtype)
                attachment.set_payload(fp.read())
                fp.close()
                encoders.encode_base64(attachment)
            attachment.add_header("Content-Disposition", "attachment", filename=os.path.basename(f))
            msg.attach(attachment)
    try:
        server = smtplib.SMTP("relay", 25)
        server.set_debuglevel(False)
        server.ehlo()
        server.starttls()
        server.ehlo()
        server.login(emailfrom, 'Algotec123')
    except (smtplib.SMTPAuthenticationError,
            smtplib.SMTPConnectError,
            smtplib.SMTPDataError,
            smtplib.SMTPException,
            smtplib.SMTPHeloError,
            smtplib.SMTPRecipientsRefused,
            smtplib.SMTPResponseException,
            smtplib.SMTPSenderRefused,
            smtplib.SMTPServerDisconnected) as e:
        sys.stderr.write("Warning: {} was caught while trying to send your mail.\nContent:{}\n"
                         .format(e.__class__.__name__, e.message))
        return 1
    err = 0
    try:
        server.sendmail(emailfrom, join_mail, msg.as_string())
    except:
        err = sys.exc_info()
    server.quit()

    return err



def write_log(file,output,error):
	if os.path.isfile(file):
		os.remove(file)
	fp = open(file, 'w+')
	body_msg = 'Output:\n\n{}\n\n\nError:\n\n{}'.format(output,error)
	fp.write(body_msg)
	fp.close()


def main ():
	source_dir = os.getenv('BUILD_SOURCESDIRECTORY')
	scripts_dir = '{}\\scripts'.format(source_dir)
	team_project = os.getenv('SYSTEM_TEAMPROJECT')
	branch = os.getenv('BUILD_SOURCEBRANCHNAME')
	build_status = 'Pass'
	build_definition = os.getenv('BUILD_DEFINITIONNAME')
	build_id = os.getenv('BUILD_BUILDID')
	tasks = ["linkedPackages","Yarn","NPM_CI","Not4CI","build_prod"]
	elapsed_sec = 0

	class email():
		emailfrom = 'freeze'
		email_to = os.getenv('BUILD_REQUESTEDFOREMAIL')
		subject = "{} {}".format(build_definition, build_id)
		attachment = []
		def build_body(self):
			messege = ' \n' + '#' * 100 + \
					   '\nBuild of {} ({}) in branch {}\nRan for {} seconds, completed at {}\n\nSummary:\nRequested by: {} with build ID: {}\n'.format(
						   build_definition, team_project, branch, elapsed_sec, datetime.now().strftime('%d-%b-%Y %H:%M:%S'), self.email_to, build_id)
			messege += '\n' + '#' * 100
			self.subject += ' {}'.format(build_status)
			return messege
		def send(self):
			messege = self.build_body()
			send_mail(emailto=self.email_to, subject=self.subject, mesage=messege,attach=self.attachment)

	class Tasks(object):
		def __init__(self):
			self.status = 'start'
		def IssueGitCommit(self):
			IssueGitCommit = "{}\\IssueGitCommit.py".format(scripts_dir)
			args = "-p {} -b {} -s {}".format(team_project,branch,self.status)
			self.status = 'end'
			return "{} {}".format(IssueGitCommit,args)
		def Yarn(self):
			return 'yarn install'
		def linkedPackages(self):
			return "{}\\linkedPackages.py".format(scripts_dir)
		def NPM_CI(self):
			return "npm run ci"
		def Not4CI(self):
			return "{}\\Not4CI.ps1".format(scripts_dir)
		def build_prod(self):
			return "{}\\build_prod.ps1".format(scripts_dir)

	t1 = datetime.now()
	mail = email()
	Tasks = Tasks()
	for t in tasks:
		command = getattr(Tasks, '%s' % t)()
		print '\n'
		print '\nRunning task: {}\n'.format(command)
		process = subprocess.Popen(command,stdout=subprocess.PIPE,stderr=subprocess.PIPE,shell=True)
		out, err = process.communicate()
		log_file = '{}\\{}.log'.format(scripts_dir, t)
		write_log(log_file, out, err)
		rc = process.returncode
		if rc != 0:
			build_status = "Failed"
			mail.attachment = [log_file]
			break
	t2 = datetime.now()
	elapsed_sec = (t2 - t1).seconds

	mail.send()
	sys.exit(rc)



if __name__ == '__main__':
	main()
