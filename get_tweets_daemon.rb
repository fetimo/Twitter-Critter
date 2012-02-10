#!/usr/bin/env ruby

#require 'rubygems'
require 'daemons'

Daemons.run('get_tweets_stream.rb');