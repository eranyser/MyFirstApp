echo %BUILD_SOURCEBRANCHNAME%
echo %BUILD_BUILDID%
echo %BUILD_BUILDNUMBER%
echo %BUILD_DEFINITIONNAME%
if '%BUILD_SOURCEBRANCHNAME%' == 'develop' (
	set dist=%BUILD_SOURCEBRANCHNAME%_*.zip
	if EXIST dist (
		del %dist%
	)
	jar -cMf %BUILD_SOURCEBRANCHNAME%_%BUILD_BUILDID%.zip dist
	jfrog rt u %BUILD_SOURCEBRANCHNAME%_%BUILD_BUILDID%.zip artifact-release-local/mp-client/ --build-name=%BUILD_DEFINITIONNAME% --build-number=%BUILD_BUILDID%
)
