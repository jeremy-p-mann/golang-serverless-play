.PHONY: install setup start

install:
	yarn install

setup:
	yarn setup

dev:
	yarn start
	yarn vercel dev

