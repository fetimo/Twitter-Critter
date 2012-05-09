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
require 'sentiment_analysis'
require File.join(File.dirname(__FILE__), 'critter_algorithm')

class MainController < Controller
	# the index action is called automatically when no other action is specified
	
	helper :flash
	
	layout do |path|
		:default
	end
	
	set_layout 'index' => [:index]
	
	trait :flashbox => "<div id='flash_%key' class='alert alert-info fade in %key'><a class='close' data-dismiss='alert'>&times;</a><p><strong>%key</strong> %value</p></div>"
		
	def show_flashbox
    	flashbox
    end
	
	def index
	end
	
	def user(username = nil)
		
		logger = Ramaze::Logger::RotatingInformer.new('./log')

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
			uid = user_info[0].id
		rescue
			#useful for if user 404s or Twitter offline
			redirect MainController.r(:critter, @user[:username])
		end

		critter_exist = 0
		begin
			DB[:critters].filter(:uid => uid).each do |row|
				critter_exist += 1
			end
		rescue => e
			DB.disconnect
			DB.connect(
				:adapter=>'mysql2', 
				:host=>'mysql.fetimo.com', 
				:database=>'twittercritter', 
				:user=>'fetimocom1', 
				:password=>'iBMbSSIz', 
				:timeout => 60
			)
			retry
			logger.info "checking critter exists main.rb:75"
			logger.info e.message
		end
		
		sleep 1.5 #allow for db to be queried
		
		if critter_exist === 0
		
			@default_critter = {
				#default values
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
		
			generate = Critter.new(@data, @user[:username], @default_critter, uid)
			@critter = generate.critter
			redirect MainController.r(:critter, @user[:username])
		else
			redirect MainController.r(:critter, @user[:username])
		end			
	end
	
	def world
		
	end
	
	def about
	
	end
	
	def critter(username)
		
		logger = Ramaze::Logger::RotatingInformer.new('./log')
		@username = username
				
		begin
			critters = DB[:critters]
			@critter = critters.filter(:name => username).first
		rescue => e
			logger.info "fetching critter from db main.rb:111"
			logger.error e.message
			DB.disconnect
			DB.connect(
				:adapter=>'mysql2', 
				:host=>'mysql.fetimo.com', 
				:database=>'twittercritter', 
				:user=>'fetimocom1', 
				:password=>'iBMbSSIz', 
				:timeout => 60
			)
			sleep 1
			retry
		end		
		#show the intro text if you've been redirected from the homepage
    	@introduction = true if request.http_variables['HTTP_REFERER'] === 'http://crittr.me/'
				
		if session[:access_token] and username == session[:access_token][:screen_name]
			session.resid!
			# only do this if you're on your own critter page due to limitations with the twitter api and friends
						
			Twitter.configure do |config|
				config.consumer_key = 'DQicogvXxpbW7oleCfV3Q'
				config.consumer_secret = 'GTYPQnV47dATvuITMXnVUC8PADpIgDPYyN84VKO6o'
				config.oauth_token = session[:access_token][:oauth_token]
				config.oauth_token_secret = session[:access_token][:oauth_token_secret]
			end
			
			#if Twitter.rate_limit_status.remaining_hits > 0
			
			begin
				friends = Twitter.friend_ids
			rescue => e
				logger.info "getting twitter friend ids main.rb:124"
				logger.error e.message
			end
			
			if session[:friends].nil?
				friends_w_critter = Array.new
				
				dataset = DB[:critters]
				begin
					friends.ids.each do |f|
						friends_db = dataset.where(:uid => f).limit(1)
						friend = friends_db.get(:name)
						friends_w_critter.push(friend)
					end
				rescue => e
					logger.info "processing existing critters from db main.rb:144"
					logger.error e.message
				end	
				
				friends_w_critter.compact! #removes blank entries leaving us with just the friends
				session[:friends] = friends_w_critter
			end
			
			if session[:friends].count < 3
				begin
					friend = Twitter.user(friends.ids.sample)
					@suggested_friend = {
						'name' => friend[:name],
						'username' => friend[:screen_name]
					}
				rescue => e
					logger.info "fetching sample friends from twitter main.rb:159"
					logger.error e.message
				end	
			end
			
			# lets find out if their latest tweet is happy or sad
			begin				
				data = Twitter.user_timeline(session[:access_token][:screen_name]).first.text
				sa = SentimentAnalysis::Client.new(:api_key => 'cPl26pIqRtPJZxFHnAP')
				
				if sa.quota > 0
					sentiment = sa.review(data)	
					
					critters = DB[:critters] 
					
					if sentiment.parsed_response['mood'] === 'positive' && sentiment.parsed_response['prob'] > 0.5
						#smile
						critters.filter('name = ?', session[:access_token][:screen_name]).update(:sentiment => 'smile')
					elsif sentiment.parsed_response['mood'] === 'negative' && sentiment.parsed_response['prob'] > 0.5
						#frown
						critters.filter('name = ?', session[:access_token][:screen_name]).update(:sentiment => 'frown')
					else
						critters.filter('name = ?', session[:access_token][:screen_name]).update(:sentiment => 'smile')
					end
				end
			rescue => e
    			logger.info "sentiment analysis and twitter last tweet main.rb:176"
    			logger.error e.message
    			logger.info "sentiment analysis quota #{sa.quota}"
				#useful for if Twitter is offline
				#critters = DB[:critters]
				#critters.filter('name = ?', session[:access_token][:screen_name]).update(:sentiment => 'frown')
				retry
			end
					
			fight = DB[:interactions]
			
			begin
				you = fight.where(:uid => session[:access_token][:user_id]).first
			rescue => e
				logger.info "fetching #{you} from db main.rb:201"
				logger.error e.message
				retry
			end	
			if !you
				fight.insert(:uid => session[:access_token][:user_id])
				you = fight.where(:uid => session[:access_token][:user_id]).first
			end
			begin
				if !you[:tutorial]
					@fisticuffs_tutorial = true
					fight.where(:uid => session[:access_token][:user_id]).update(:tutorial => 1)
				end
			rescue
				logger.info "#{!you[:tutorial].inspect} from db main.rb:216"
				logger.error e.message
				retry
			end
			if you[:weapon] === nil && you[:opponent]
				opponent = Twitter.user(you[:opponent]).screen_name
				flash[:Fisticuffs] = "#{opponent} has started fisticuffs with you! <p><a class='btn btn-success' href='#'>Arm Yourself</a><a class='btn btn-danger close_btn' href='#'>Run Away</a></p>"
			end
			if you[:opponent] and request.http_variables['HTTP_REFERER'] === 'http://crittr.me/'
				# only show the first time you see your Critter that session (probably)
				opponent = Twitter.user(you[:opponent]).screen_name
				flash[:Reminder] = "You're still in fisticuffs with #{opponent}."
			end
			if you[:hugged_by]
				flash[:Hugs] = "You've been hugged by "
				hugs = you[:hugged_by].split(',')
				hugs.uniq!
				hugs.each_with_index do |hug, index|
					if index > 0
						flash[:Hugs] << " and "
					end
					flash[:Hugs] << hug
				end
				flash[:Hugs] << " :)"
				
				fight.where(:uid => session[:access_token][:user_id]).update(:hugged_by => nil)
			end
			if you[:ran_away] #if opponent ran away
				opp = Twitter.user(you[:ran_away]).screen_name
				
				flash[:Ran] = opp << " didn't want to fight and ran away!"
				
				fight.where(:uid => session[:access_token][:user_id]).update(:ran_away => nil)
			end
			
			#check to see if the battle is a day old and you've not had a result back
			@request_expire_battle = false
			if you[:start] and you[:status] == 'waiting'
				require 'date'
				start = you[:start].to_datetime
				yesterday = Date.today - 1
				@request_expire_battle = true if start <= yesterday
				@opponent_name = Twitter.user(you[:opponent]).screen_name
				@opponent_uid = you[:opponent]
			end
			
			if you[:status] === 'ready'
				#if in battle
				opponent = fight.where(:uid => you[:opponent]).first
				if opponent
					if opponent[:status] === 'ready'
						weapon = you[:weapon]
						opp_weapon = opponent[:weapon]
						@result = ''
						flash[:Fisticuffs] = 'The results are in, you '
						
						if weapon.eql? opp_weapon
							result = 'draw'
							opp_status = 'draw'
						elsif weapon.eql? 1 and opp_weapon.eql? 2
							result = 'win'
							opp_status = 'lose'
						elsif weapon.eql? 2 and opp_weapon.eql? 1
							result = 'lose'
							opp_status = 'win'
						elsif weapon.eql? 3 and opp_weapon.eql? 1
							result = 'win'
							opp_status = 'lose'
						elsif weapon.eql? 1 and opp_weapon.eql? 3
							result = 'lose'
							opp_status = 'win'
						elsif weapon.eql? 2 and opp_weapon.eql? 3
							result = 'win'
							opp_status = 'lose'
						elsif weapon.eql? 3 and opp_weapon.eql? 2
							result = 'lose'
							opp_status = 'win'
						end
						flash[:Fisticuffs] << "#{result} against #{Twitter.user(you[:opponent]).screen_name}! Now hug to make up, no hard feelings, eh?"
						
						# deletes all battle data for a fresh start
						begin
							unless result.include? 'win'
								opp = you[:opponent]
								DB.transaction do
									fight.where(:uid => you[:uid]).update(:status => nil, :opponent => nil, :weapon => nil, :start => nil)
									fight.where(:uid => opp).update(:status => opp_status)
								end
							else
								flash[:Fisticuffs] << "<br>Is it okay if I tweet about your victory?<p><a class='btn btn-info' href='#'>No, thanks</a><a class='btn close_btn' href='#'><span id='victory_tweet'>Tweet</span></a></p>"
							end
						rescue => e
							logger.info "main.rb:281"
							logger.error e.message
							message = e.message
						end
					end
				end
			elsif you[:status] === 'win' || you[:status] === 'draw' || you[:status] === 'lose'
				#you have won, lost, or drawn but you weren't the first to know about it
				flash[:Fisticuffs] = "The results are in, you #{you[:status]} against #{Twitter.user(you[:opponent]).screen_name}! Now hug to make up, no hard feelings, eh?"
				unless you[:status].include? 'win'
					fight.where(:uid => you[:uid]).update(:status => nil, :opponent => nil, :weapon => nil, :start => nil)
				else
					flash[:Fisticuffs] << "<br>Is it okay if I tweet about your victory?<p><a class='btn btn-info' href='#'>No, thanks</a><a class='btn close_btn' href='#'><span id='victory_tweet'>Tweet</span></a></p>"
				end
			end
		end
	end
	
	def logout
		session.delete(:friends)
		session.delete(:access_token)
		redirect MainController.r(:index)
	end
	
	def evolve(username)
		
		if request.post?
			
			begin
				client = TwitterOAuth::Client.new(
					:consumer_key => 'DQicogvXxpbW7oleCfV3Q',
					:consumer_secret => 'GTYPQnV47dATvuITMXnVUC8PADpIgDPYyN84VKO6o'
				)
				begin
					request_token = client.authentication_request_token(:oauth_callback => 'http://crittr.me/auth')
				rescue => e
					logger.info "getting request_token main.rb:330"
					logger.error e.message
					sleep 5
					retry
				end	
				session[:request_token] = request_token
				
				redirect request_token.authorize_url
			rescue OAuth::Unauthorized
				flash[:error] = 'You were unauthorized by Twitter :('
				redirect MainController.r(:index)
			end
		end
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
		
		session[:access_token] = {
			:oauth_token => access_token.token,
			:oauth_token_secret => access_token.secret,
			:screen_name => access_token.params[:screen_name],
			:user_id => access_token.params[:user_id]
		}
					
		if client.authorized?
			redirect MainController.r(:critter, session[:access_token][:screen_name])
		else
			redirect MainController.r(:index)
		end
	end
	
	def self.action_missing(path)
		return if path == '/not-found'
		# No normal action, runs on bare metal
		try_resolve('/not-found')
	end
	
	def error_404
		render_file("#{Ramaze.options.views[0]}/not-found.xhtml")
	end
	
	# the string returned at the end of the function is used as the html body
	# if there is no template for the action. if there is a template, the string
	# is silently ignored
	def notemplate
		@title = 'Critter'
		return 'There is no \'notemplate.xhtml\' associated with this action.'
	end
end
