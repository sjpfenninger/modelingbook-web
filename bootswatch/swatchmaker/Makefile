#
# BUILD BOOTSWATCH SWATCH
#

bootswatch:
	lessc ./swatchmaker.less > swatch/bootstrap.css
	lessc --compress  ./swatchmaker.less > swatch/bootstrap.min.css

bootstrap:
	-test -d bootstrap && rm -r bootstrap
	curl --location -o latest_bootstrap.tar.gz https://github.com/twitter/bootstrap/tarball/master	
	tar -xvzf latest_bootstrap.tar.gz
	mv twitter-bootstrap* bootstrap
	rm latest_bootstrap.tar.gz

deploy:
	-test -f ../../static/libraries/bootstrap.css && rm ../../static/libraries/bootstrap.css
	cp swatch/bootstrap.css ../../static/libraries/

.PHONY: bootswatch bootstrap

