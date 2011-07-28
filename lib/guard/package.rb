require 'guard'
require 'guard/guard'
require 'guard/watcher'

require File.expand_path('../../package.rb', __FILE__)

module Guard
  class Package < Guard

    def self.[](name)
      ::Package[name]
    end

    def initialize(watchers, options)
      super watchers, options

      @watchers, @options = watchers, options

      @package   = options[:package]
      @validator = options[:validator]
    end

    def run_on_change(paths)
      paths.each do |path|
        next unless @package.include? path
        next unless @validator.call(path)

        @package.build

        ::Guard::UI.info "# '#{ @package }' written"
      end
    end

    def run_all
      run_on_change Watcher.match_files(self, Dir.glob(File.join('**', '*.*')))
    end

  end
end
