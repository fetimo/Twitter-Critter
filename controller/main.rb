# Default url mappings are:
# 
# * a controller called Main is mapped on the root of the site: /
# * a controller called Something is mapped on: /something
# 
# If you want to override this, add a line like this inside the class:
#
#  map '/otherurl'
#
# this will force the controller to be mounted on: /otherurl.

require 'twitter_oauth'
require 'twitter'
#require 'sentiment_analysis'
require File.join(File.dirname(__FILE__), 'critter_algorithm')

class MainController < Controller
	# the index action is called automatically when no other action is specified
	
	provide(:js, :type => 'application/javascript') do |action, value|
		value
	end
	provide(:css, :type => 'text/css') do |action, value|
		value
	end
		
	layout do |path|
		if path === 'critters'
			:api
		else
			:default
		end
	end
	
	set_layout 'index' => [:index]
	
	def index
	end
	
	def user		
		if request.post?
			@user = ::User.new
			#gets username from posted query string, uses this to get tweet from timeline
			@user[:username] = request[:username]

			@user[:username].delete!('@') #removes @ in username		
			
			begin
				@data = Twitter.user_timeline(@user[:username]).first.text
				user_info = Twitter.users(@user[:username])
				@uid = user_info[0].id
			rescue
				#useful for if user 404s or Twitter offline
				redirect MainController.r(:critter, @user[:username])
			end
			
			@default_critter = {
				#default values
				:location => 0,
				:name => 'Steve',
				:arms => 'medium',
				:eye_colour => 'brown',
				:eye_shape => 'normal',
				:neck => 'medium',
				:legs => 'medium',
				:face => 'blank',
				:hands => 'simple',
				:hair_colour => 'brown',
				:hair_length => 'medium',
				:body_colour => 'black',
				:body_weight => 'medium',
				:body_tail => 'none',
				:accessory => 'none',
				:critter => '',
				:uid => @uid
			}
			
			generate = Critter.new(@data, @user[:username], @default_critter)
			@critter = generate.critter
									
			redirect MainController.r(:critter, @user[:username])
		end
	end
	
	def world
		@title = 'Welcome to the world'
	end
	
	def critter(username)
		@username = username
		DB.fetch('SELECT critter FROM critters WHERE name = ? LIMIT 1', @username) do |row|
			@critter = row[:critter]
		end
		
		if session[:access_token] and username == session[:access_token].params[:screen_name]
			# only do this if you're on your own critter page due to limitations with the twitter api and friends
			#TODO: Expire friends session after x time
						
			p = session[:access_token].params
			
			Twitter.configure do |config|
				config.consumer_key = '3s7bWz9YWoXGyhg6lwVQsg'
				config.consumer_secret = 'l8ZPe0N8ahMBKYZ8bhNNYnGjAybekHmlRDlYu466KM'
				config.oauth_token = p[:oauth_token]
				config.oauth_token_secret = p[:oauth_token_secret]
			end
						
			friends = Twitter.friend_ids
			
			if session[:friends].nil?			
				friends_w_critter = Array.new
				
				dataset = DB[:critters]
				
				friends.ids.each do |f|
					friends_db = dataset.where(:uid => f).limit(1)
					friend = friends_db.get(:name)
					friends_w_critter.push(friend)
				end
				
				friends_w_critter.compact! #removes blank entries leaving us with just the friends
				session[:friends] = friends_w_critter
			end
			
			if session[:friends].count < 3
				@suggested_friend = {
					'name' =>	Twitter.user(friends.ids.sample)[:name],
					'username' => Twitter.user(friends.ids.sample)[:screen_name]
				}
			end
						
			#session[:suggest_friend] = @suggested_friend		
			
		end
	end
	
	def logout
		session.delete(:friends)
		session.delete(:access_token)
		redirect MainController.r(:index)
	end
	
	def critters(username)
		response['Content-Type'] = 'application/json'
		
		username.delete!('@')
		
		if request.get? 
			DB.fetch('SELECT critter FROM critters WHERE name = ? LIMIT 1', username) do |row|
				@critter = row[:critter]
			end
		end
		
	#	if request.get? 
     #  json = { 'data' => 'Service Two Data' }.to_json 
     #elsif request.put? 
     #  json = { 'result' => 'Service Two result' }.to_json 
     #elsif request.delete?
		
		@critter
	end
		
	def evolve
		
		client = TwitterOAuth::Client.new(
			:consumer_key => '3s7bWz9YWoXGyhg6lwVQsg',
			:consumer_secret => 'l8ZPe0N8ahMBKYZ8bhNNYnGjAybekHmlRDlYu466KM'
		)
				
		request_token = client.request_token(:oauth_callback => 'http://crittr.me/auth')
						
		session[:request_token] = request_token
				
		redirect request_token.authorize_url
	end
		
	def auth
				
		if request.params['denied']
			redirect MainController.r(:index)
		end
					
		if session[:request_token].eql? nil then 
			redirect MainController.r(:evolve) 
		end
		
		client = TwitterOAuth::Client.new(
			:consumer_key => '3s7bWz9YWoXGyhg6lwVQsg',
			:consumer_secret => 'l8ZPe0N8ahMBKYZ8bhNNYnGjAybekHmlRDlYu466KM'
		)
						
		access_token = client.authorize(
			session[:request_token].token,
			session[:request_token].secret,
			:oauth_verifier => request.params[:oauth_verifier]
		)
		
		session[:access_token] = access_token
				
		p = access_token.params
					
		if client.authorized?
=begin
			begin
				@auth_users = DB[:authorised_users]
				@auth_users.insert(p[:oauth_token], p[:oauth_token_secret], p[:user_id], p[:screen_name])
			rescue Sequel::DatabaseError
				logger.error "database error (probably because user has already authorised Critter)"
			end
=end
						
			redirect MainController.r(:critter, p[:screen_name])
		end
			
	end

	# the string returned at the end of the function is used as the html body
	# if there is no template for the action. if there is a template, the string
	# is silently ignored
	def notemplate
		@title = 'Welcome to Ramaze!'
		return 'There is no \'notemplate.xhtml\' associated with this action.'
	end
end

=begin
Setting mime types

https://github.com/rack/rack/blob/master/lib/rack/mime.rb#L21-39
Rack::Mime::MIME_TYPES['.foo'] = 'foo/bar'
=end