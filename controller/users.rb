require 'ramaze'
require 'model/user'

class Users < Ramaze::Controller
	map '/'
	
	def user
		@title = 'Saved!'
		puts 'test'
		if request.post?
			@user = ::User.new
		#@user[:username] = request[:username]
		
		if @user.save
			flash[:message] = 'Successfully added!'
			redirect MainController.rb(:index)
		else
			flash[:message] = 'Something went wrong :('
		end
	end
end