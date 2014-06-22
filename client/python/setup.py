from distutils.core import setup

setup(name='datastream',
	version='0.0.1',
	descirption='Python library for listening to datastream events',
	author='Guy Carpenter',
	author_email='guy@clearwater.com.au',
	url='http://github.com/guyc/datastream',
	license = "LICENSE.txt',
	long_description=open('README.txt').read(),
	packages=['datastream-client'],
)
