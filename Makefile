container := $(notdir $(CURDIR))_dev-box

.PHONY: run
run:
	docker build . -t $(container) && docker run --rm --init -it -p 3000:3000 $(container)
