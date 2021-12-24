HOSTNAME = builder-test.meteorapp.com

default: start-dev

~/.meteor:
	@echo Installing Meteor...
	@curl https://install.meteor.com/ | sh

.PHONY: _install-dependencies
_install-dependencies: ~/.meteor
	@echo Installing NPM dependencies
	@~/.meteor/meteor npm install

start-dev: _install-dependencies
	@echo "Starting dev server..."
	@~/.meteor/meteor --exclude-archs web.browser.legacy

deploy: _install-dependencies
	@~/.meteor/meteor deploy ${HOSTNAME} --free --mongo

clean:
	@echo "Removing generated files..."
	@rm -rf node_modules .meteor/local
