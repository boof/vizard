uglify_bin   = `which uglifyjs`.chomp
uglify_bin   = '~/node_modules/uglify-js/bin/uglifyjs' if uglify_bin.empty?

root         = File.expand_path '..', __FILE__
version      = File.read File.join(root, 'VERSION').chomp
sources      = %w[ core tools prototype controls filter/doctype filter/base_tag filter/noscript jquery ]
vendored     = %W[ difflib xhtml-0.3 ]
uncompressed = File.join root, 'public', 'js', "vizard-#{ version }.js"
compressed   = File.join root, 'public', 'js', "vizard-#{ version }.min.js"

task :concat do
  File.open uncompressed, 'w' do |file|
    vendored.each do |path|
      buffer = File.read File.join(root, 'vendor', "#{ path }.js")
      file << buffer
    end
    sources.each do |path|
      buffer = File.read File.join(root, 'source', "#{ path }.js")
      file << buffer
    end
  end
end
task :minify => [ :concat ] do
  File.open compressed, 'w' do |file|
    file << `#{ uglify_bin } -nc #{ uncompressed }`
  end
end
