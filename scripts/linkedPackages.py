import os,json,subprocess,sys



def exe_command(command):
	process = subprocess.Popen(command,stdout=subprocess.PIPE,stderr=subprocess.PIPE,shell=True)
	out,err = process.communicate()
	rc = process.returncode
	return rc, err


def run_linker_commands(package,url,branch,src_dir):
	commands = []
	commands.append('rm -rf node_modules/{}'.format(package))
	commands.append('git clone -b {} {} node_modules/{}'.format(branch,url,package))
	commands.append('npm install')
	commands.append('npm run build')
	for command in commands:
		if 'npm' in command:
			os.chdir('{}\\node_modules\\{}'.format(src_dir,str(package)))
		else:
			os.chdir(src_dir)
		print '\nRunning: {} in working directory: ({})'.format(command, os.getcwd())
		rc, err = exe_command(command)
		if rc != 0:
			print '\nFailed on: {}'.format(command)
			print '\n\nError: {}'.format(err)
			sys.exit(1)

def get_linkedPackaged(j_son):
	pkgs = []
	for j in j_son:
		if j == 'ciConfig':
			for pkg in j_son[j]['linkedPackaged']:
				pkgs[pkg.replace('/', '\\')] = j_son[j]['linkedPackaged'][pkg]
	return pkgs

def main():
	source_dir = os.getenv('BUILD_SOURCESDIRECTORY')
	os.chdir(source_dir)
	print os.getenv('BUILD_SOURCESDIRECTORY')
	print os.getcwd()
	package_json = '{}\\package.json'.format(source_dir)
	print '\nSearching for packages in {}'.format(package_json)
	with open(package_json, 'rb') as f_pkg:
		j_son = json.load(f_pkg)

	#get packages from json into dict var
	pkgs = get_linkedPackaged(j_son)
	if pkgs:
		print '\nFound the following packages to work with:\n'
		for pkg in pkgs:
			print pkg
	else:
		print '\nNo packages found in package.json'

	#run relevant commands
	for pkg in pkgs:
		url = pkgs[pkg]['url']
		branch = pkgs[pkg]['branch']
		run_linker_commands(pkg,url,branch,source_dir)

if __name__ == '__main__':
	main()
