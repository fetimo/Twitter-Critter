#!/usr/bin/env ruby

#require 'rubygems'
require 'daemons'

Daemons.run('get_tweets_stream.rb');

#as uid 12536825 and gid 628208