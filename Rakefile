uglify_bin   = '~/node_modules/uglify-js/bin/uglifyjs'

root         = File.expand_path '..', __FILE__
version      = File.read File.join(root, 'VERSION').chomp
sources      = %w[ core tools filter/base_tag filter/noscript prototype jquery ]
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
task :boot do
  File.open File.join(root, 'public', 'js', "boot-#{ version }.min.js"), 'w' do |file|
    file << `#{ uglify_bin } -nc #{ File.join root, 'source', 'boot.js' }`
  end
end
task :minify => [ :boot, :concat ] do
  File.open compressed, 'w' do |file|
    file << `#{ uglify_bin } -nc #{ uncompressed }`
  end
end