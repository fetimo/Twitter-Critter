require 'twitter'
#require 'critter_algorithm'
require File.join(File.dirname(__FILE__), '../controller/critter_algorithm')

class User < Sequel::Model(:users)
	def after_create
		@new = false
		@values[:username].delete!('@') #removes @ in username		
		save
=begin		
		Thread.new do
			@data = Twitter.user_timeline(@values[:username]).first.text
			Critter.new(@data, @values[:username])
		end
=end
	end
end