require File.expand_path('../lib/guard/package', __FILE__)

module Lint
  module Validator

    @@bin_path = `which jsl`.chomp
    raise 'Could not find JavaScript Lint.' if @@bin_path.empty?

    def self.call(path)
      system "#{ @@bin_path } -nologo -conf jsl.conf -process #{ path }"
    end

  end
end

load 'vizard.rpd'

guard 'package', :package => ::Package[:vizard], :validator => Lint::Validator do
  watch(/^.+\.js$/)
end
