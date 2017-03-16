import jira, sys, argparse, os,re
from git import Repo

def jira_init():
	username = 'administrator'
	password = 'kartoshka'
	jira_server = 'http://jiravm'
	return jira.JIRA(server=jira_server,basic_auth=(username,password))

def parse_commit(projects,commit_msg):
	for project in projects:
		match = re.search('{}-\d*'.format(project),commit_msg)
		if match:
			commit_id = match.group(0)
			return project, commit_id
	return False

def get_issue(project,issue_id):
	issue = jira_session.search_issues("project = \"{}\" AND issuekey = {}".format(project, issue_id))
	return issue

def update_gitcommit(issue,commit_url):
	git_commit_value = str(issue[0].fields.customfield_14601)
	if git_commit_value != "None":
		git_commit_value = "{} ,\r\n{}".format(commit_url,git_commit_value)
	else:
		git_commit_value = commit_url
	issue[0].update(fields={'customfield_14601': git_commit_value})


def update_nextbuild(issue,build_status):
	if build_status == "start":
		issue[0].update(fields={'customfield_11868': {'value': 'Pending build'}})
	elif build_status == "end":
		issue[0].update(fields={'customfield_11868': {'value': 'Yes'}})

def get_commit_info():
	head = repo.head.commit
	msg = head.message
	id = head.hexsha
	return msg, id



def main():
	global jira_session
	global repo

	parser = argparse.ArgumentParser()
	parser.add_argument("-p","--build_teamproject", help="Team project", required=True)
	parser.add_argument("-b", "--branch", help="Branch", required=True)
	parser.add_argument("-s","--status", help="Build status", required=True)

	build_teamproject = parser.parse_args().build_teamproject
	branch = parser.parse_args().branch
	build_status = parser.parse_args().status

	git_url = "http://git-srv:8080/tfs/DefaultCollection/_git"
	#init repo
	repo = Repo(os.getcwd())
	commit_msg, commit_id = get_commit_info()

	print "---------------------"
	print "Git Info:\n"
	print "Commit id: {} \nCommit message: {} \nBranch: {}".format(commit_id,commit_msg,branch)

	if branch == 'develop':

		projects = ['ALGCQ','WEBUX']
		#parse issue id from commit msg
		project, issue_id = parse_commit(projects,str(commit_msg).upper())

		if issue_id:
			commit_url = "{}/{}/commit/{}".format(git_url,build_teamproject,commit_id)
		else:
			err = "\n\nCommit id is invalid.\n\n"
			sys.exit(err)

		#initilize jira session
		jira_session = jira_init()
		print "---------------------"
		print "Debug Info:\n"
		print "\nProject: {}, Issue to update: {}, Commit url: {}".format(project,issue_id,commit_url)

		#get issue to update
		issue = get_issue(project,issue_id)
		#added commit to jira issue and set next build field to 'pending build'
		update_gitcommit(issue,commit_url)

		#update next build field, 'pending build' at start of build and 'yes' at the end of the build
		update_nextbuild(issue,build_status)
	else:
		print "Branch: {}, this script should only work with develop branch".format(branch)


if __name__ == "__main__":
	main()

