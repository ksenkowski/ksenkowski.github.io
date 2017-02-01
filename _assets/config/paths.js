var paths = {};

//Directory Locations
paths.assetsDir			=	'_assets/'			//Gulp's responsibility
paths.jekyllDir			=	'';					//Jekyll's responsibility
paths.jekyllAssetsDir	=	'assets/';			//The asset files Jekyll handles
paths.siteDir			=	'_site/';			//Static site!
paths.siteAssetsDir		=	'_site/assets/';	//Static site's assets

//Folder Naming Conventions
paths.postFolderName	=	'_posts';
paths.draftFolderName	=	'_drafts';
paths.fontFolderName	=	'fonts';
paths.imageFolderName	=	'img';
paths.scriptFolderName	=	'js';
paths.cssFolderName		=	'css';

//Asset File Locations
paths.sassFiles = paths.assetsDir + paths.cssFolderName;
paths.jsFiles     = paths.assetsDir + paths.scriptFolderName;
paths.imageFiles  = paths.assetsDir + paths.imageFolderName;
paths.fontFiles   = paths.assetsDir + paths.fontFolderName;

//Jekyll File Locations
paths.jekyllPostFiles  = paths.jekyllDir       + paths.postFolderName;
paths.jekyllDraftFiles = paths.jekyllDir       + paths.draftFolderName;
paths.jekyllCssFiles   = paths.jekyllAssetsDir + paths.cssFolderName;
paths.jekyllJsFiles    = paths.jekyllAssetsDir + paths.scriptFolderName;
paths.jekyllImageFiles = paths.jekyllAssetsDir + paths.imageFolderName;
paths.jekyllFontFiles  = paths.jekyllAssetsDir + paths.fontFolderName;

//Site File Locations
paths.siteCssFiles   = paths.siteAssetsDir + paths.cssFolderName;
paths.siteJsFiles    = paths.siteAssetsDir + paths.scriptFolderName;
paths.siteImageFiles = paths.siteAssetsDir + paths.imageFolderName;
paths.siteFontFiles  = paths.siteAssetsDir + paths.fontFolderName;

//GLOB Patterns by File Type
paths.sassPattern     = '/**/*.scss';
paths.jsPattern       = '/**/*.js';
paths.imagePattern    = '/**/*.+(jpg|JPG|jpeg|JPEG|png|PNG|svg|SVG|gif|GIF|webp|WEBP|tif|TIF)';
paths.markdownPattern = '/**/*.+(md|MD|markdown|MARKDOWN)';
paths.htmlPattern     = '/**/*.html';
paths.xmlPattern      = '/**/*.xml';

//Asset File GLOBs
paths.sassFilesGlob  = paths.sassFiles  + paths.sassPattern;
paths.jsFilesGlob    = paths.jsFiles    + paths.jsPattern;
paths.imageFilesGlob = paths.imageFiles + paths.imagePattern;

//Jekyll File GLOBs
paths.jekyllPostFilesGlob  = paths.jekyllPostFiles  + paths.markdownPattern;
paths.jekyllDraftFilesGlob = paths.jekyllDraftFiles + paths.markdownPattern;
paths.jekyllHtmlFilesGlob  = paths.jekyllDir        + paths.htmlPattern;
paths.jekyllXmlFilesGlob   = paths.jekyllDir        + paths.xmlPattern;
paths.jekyllImageFilesGlob = paths.jekyllImageFiles + paths.imagePattern;

// Site File GLOBs
paths.siteHtmlFilesGlob = paths.siteDir + paths.htmlPattern;

module.exports = paths;