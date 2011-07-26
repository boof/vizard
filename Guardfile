require File.expand_path('../lib/guard/join', __FILE__)
require File.expand_path('../lib/package', __FILE__)

module Lint
  module Validator

    @@bin_path = `which jsl`.chomp
    raise 'Could not find JavaScript Lint.' if @@bin_path.empty?

    def call(path)
      system "#{ @@bin_path } -nologo -conf jsl.conf -process #{ path }"
    end
    alias_method :[], :call
    module_function :call, :[]

  end
end

load 'vizard.join'

guard 'join', :package => Package[:vizard], :validator => Lint::Validator do
  watch(/^.+\.js$/)
end
