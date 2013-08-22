#!/usr/bin/env bash

echo "Updating package index..."
aptitude update >/dev/null

echo "Installing build dependencies..."
aptitude install -y ruby1.9.3 build-essential uglifyjs apache2 >/dev/null

echo "Symlinking document root..."
rm -rf /var/www
ln -fs /vagrant/public /var/www

command -v jsl >/dev/null 2>&1 || {
	echo "Downloading source and building JavaScript Lint..."

	wget -O /dev/stdout --quiet "http://www.javascriptlint.com/download/jsl-0.3.0-src.tar.gz" |
	tar xzC /usr/local/src

	cd /usr/local/src/jsl-0.3.0/src
	BUILD_OPT=1 make -f Makefile.ref >/dev/null 2>&1

	cp Linux_All_OPT.OBJ/jsl /usr/local/bin/jsl
}

command -v bundle >/dev/null 2>&1 || {
	echo "Installing bundler..."
	gem install --no-ri --no-rdoc bundler
}

cd /vagrant

echo "Installing runtime dependencies..."
bundle >/dev/null


rake1.9.3
ps -ef | grep "guard" | grep -v "grep" >/dev/null ||
	bundle exec guard >/dev/null &

echo "Background processing started."
