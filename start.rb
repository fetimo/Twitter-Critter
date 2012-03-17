
require File.expand_path('../app', __FILE__)

    require 'zlib'
     
    class Ramaze::Tool::GZip
     
      # Enable this filter
      trait :enable => true
     
      trait :content_types => [
      'text/html', 'text/plain', 'text/xml'
      ]
     
      class << self
     
        include Ramaze::Trinity
     
        # Enables being plugged into Dispatcher::Action::FILTER
     
        def call(response, options = {})
          return response unless trait[:enable]
          return response if response.body.nil?
          return response if response.body.respond_to?(:read)
          return response if !accepts_gzip?
     
          if trait[:content_types].include?(response.content_type) &&
                      response.body.size > 50_000
            output = StringIO.new
            def output.close
              # Zlib does a close. Bad Zlib...
              rewind
            end
            gz = Zlib::GzipWriter.new( output )
            gz.write( response.body )
            gz.close
     
            if output.length < response.body.length
                response.body = output.string
                response.header[ 'Content-encoding' ] = 'gzip'
            end
          end
     
          response
        end
       
      private
        def accepts_gzip?
          accepts = request['HTTP_ACCEPT_ENCODING']
          accepts && accepts =~ /(x-gzip|gzip)/
        end
       
      end
    end


Ramaze.start(:adapter => :webrick, :port => 7000, :file => __FILE__)
