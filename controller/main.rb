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
	
#	provide(:js, :type => 'application/javascript') do |action, value|
#		value
#	end
#	provide(:css, :type => 'text/css') do |action, value|
#		value
#	end
#	
#	
	helper :flash
	
	layout do |path|
		:default
	end
	
	set_layout 'index' => [:index]
	
	trait :flashbox => "<div class='alert alert-info fade in %key'><a class='close' data-dismiss='alert'>&times;</a><p><strong>%key</strong> %value</p></div>"
	
	def show_flashbox
    	flashbox
    end
	
	def index
	end
	
	def user(username = nil)
		@user = ::User.new
		if request.post?
			#gets username from posted query string, uses this to get tweet from timeline
			@user[:username] = request[:username]
		elsif request.get?
			@user[:username] = username
		else
			redirect MainController.r(:index)
		end

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
			:arms => 'short',
			:eye_colour => 'blue',
			:nose => 'none',
			:legs => 'short',
			:ears => 'none',
			:face => 'none',
			:hands => 'none',
			:mouth => 'plain',
			:accessory => 'none',
			:body => 'plain',
			:body_colour => 'orange',
			:body_type => 'simple',
			:critter => '',
			:uid => 0
		}

		critter_exist = 0
		
		DB[:critters].filter(:uid => @uid).each do |row|
			critter_exist += 1
		end
		
		sleep 1 #allow for db to be queried
		
		if critter_exist === 0
			generate = Critter.new(@data, @user[:username], @default_critter, @uid)
			@critter = generate.critter
			redirect MainController.r(:critter, @user[:username])
		else
			redirect MainController.r(:critter, @user[:username])
		end			
	end
	
	def world
		@title = 'Welcome to the world'
	end
	
	def critter(username)
		#session.flush # experimental, remove asap
		@username = username
		DB.fetch('SELECT critter FROM critters WHERE name = ? LIMIT 1', @username) do |row|
			@critter = row[:critter]
		end

		if session[:access_token] and username == session[:access_token].params[:screen_name]
			session.resid!
			# only do this if you're on your own critter page due to limitations with the twitter api and friends
			#TODO: Expire friends session after x time
						
			p = session[:access_token].params
			
			Twitter.configure do |config|
				config.consumer_key = 'DQicogvXxpbW7oleCfV3Q'
				config.consumer_secret = 'GTYPQnV47dATvuITMXnVUC8PADpIgDPYyN84VKO6o'
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
						
			fight = DB[:battle_system]
			you = fight.where(:uid => p[:user_id]).first
			if you
				if you[:weapon] === nil
					opponent = Twitter.user(you[:opponent]).screen_name
					flash[:Fisticuffs] = "#{opponent} has started fisticuffs with you! <a>Arm yourself by clicking here.</a>"
				end
				if you[:status] === 'ready'
					#if in battle
					opponent = fight.where(:uid => you[:opponent]).first
					if opponent
						if opponent[:status] === 'ready'
							weapon = you[:weapon]
							opp_weapon = opponent[:weapon]
							@result = ''
							flash[:Fisticuffs] = 'Result is in, you '
							
							if weapon === opp_weapon
								flash[:Fisticuffs] << 'draw'
							elsif weapon === 1 and opp_weapon === 2
								flash[:Fisticuffs] << 'win'
							elsif weapon === 2 and opp_weapon === 1
								flash[:Fisticuffs] << 'lose'
							elsif weapon === 3 and opp_weapon === 1
								flash[:Fisticuffs] << 'win'
							elsif weapon === 1 and opp_weapon === 3
								flash[:Fisticuffs] << 'lose'
							elsif weapon === 2 and opp_weapon === 3
								flash[:Fisticuffs] << 'win'
							elsif weapon === 3 and opp_weapon === 2
								flash[:Fisticuffs] << 'lose'
							end
							flash[:Fisticuffs] << '! Now Hug to make up, no hard feelings, eh?' 
						end
					end
				end
			end
			
			if session[:friends].count < 3
				friend = Twitter.user(friends.ids.sample)
				@suggested_friend = {
					'name' => friend[:name],
					'username' => friend[:screen_name]
				}
			end
		end
	end
	
	def logout
		session.delete(:friends)
		session.delete(:access_token)
		redirect MainController.r(:index)
	end
	
	def evolve
		
		client = TwitterOAuth::Client.new(
			:consumer_key => 'DQicogvXxpbW7oleCfV3Q',
			:consumer_secret => 'GTYPQnV47dATvuITMXnVUC8PADpIgDPYyN84VKO6o'
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
			:consumer_key => 'DQicogvXxpbW7oleCfV3Q',
			:consumer_secret => 'GTYPQnV47dATvuITMXnVUC8PADpIgDPYyN84VKO6o'
		)
						
		access_token = client.authorize(
			session[:request_token].token,
			session[:request_token].secret,
			:oauth_verifier => request.params[:oauth_verifier]
		)
		
		session[:access_token] = access_token
				
		p = access_token.params
			
		if client.authorized?
			begin
				@auth_users = DB[:authorised_users]
				@auth_users.insert(p[:user_id], p[:screen_name])
			rescue Sequel::DatabaseError
				#logger.error "database error (probably because user has already authorised Critter)"
			end
						
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