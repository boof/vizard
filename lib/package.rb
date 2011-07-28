class Package

  attr_reader :output_path
  alias_method :path, :output_path
  alias_method :to_s, :output_path

  @@packages = Hash.new do |h, name|
    load "#{ name }.rpd"
    h.fetch name
  end

  def self.new( output_path, root = Dir.getwd )
    if Hash === output_path
      name = output_path.keys.first
      output_path = output_path.values.first
    else
      name = output_path
    end

    @@packages[name] = super output_path, root
  end
  def self.[](name)
    @@packages[name]
  end
  def self.each
    @@packages.values.each { |package| yield package }
  end

  def initialize( output_path, root )
    @output_path = File.expand_path output_path, root
    @input_paths = {}

    @root = root

    scope = Scope.new(root)
    yield scope
    scope.each { |path| @input_paths[path] = true }
  end

  def include?(path)
    @input_paths.member? File.expand_path(path, @root)
  end

  def each
    @input_paths.keys.each { |path| yield path }
  end
  def build
    File.open(@output_path, 'w') { |o| each { |path| o << File.read(path) } }
  end

  def inspect
    { :@output_path => @input_paths.keys }.inspect
  end

  class Scope < BasicObject
    File   = ::File
    Kernel = ::Kernel
    String = ::String

    def self.new(root)
      instance = allocate
      instance.__init__ root
      instance
    end

    def __init__(root)
      @root, @paths = root, {}
    end

    def method_missing(path, *paths)
      scope = Scope.new File.join(@root, path.to_s)
      @paths[path] = scope
      scope / paths
      yield scope if Kernel.block_given?
      scope
    end

    def <<(path)
      @paths[path] = File.join(@root, path)
    end
    def /(paths)
      paths.each { |path| self << path }
    end

    def each
      paths = []

      @paths.values.each do |path|
        case path
        when Scope
          path.each do |path|
            yield path
            paths << path
          end
        when String
          yield path
          paths << path
        end
      end

      paths
    end

  end

end
