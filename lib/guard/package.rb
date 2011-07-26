require 'guard'
require 'guard/guard'
require 'guard/watcher'

require File.expand_path('../../package.rb', __FILE__)

module Guard
  class Package < Guard

    def initialize(watchers, options)
      super watchers, options

      @watchers, @options = watchers, options

      @package   = options[:package]
      @validator = options[:validator]
    end

    def run_all
      run_on_change Watcher.match_files(self, Dir.glob(File.join('**', '*.*')))
    end
    def run_on_change(paths)
      # TODO run notify on @package.path
      paths.each do |path|
        if @package.include? path and @validator.call(path)
          @package.build
          ::Guard::UI.info "# '#{ @package }' written"
        end
      end
    end

    # notifies other guards
    def notify(changed_files)
      other = ::Guard.guards - [ self ]
      other.each do |guard|
        paths = Watcher.match_files(guard, changed_files)
        guard.run_on_change paths unless paths.empty?
      end
    end

  end
end
