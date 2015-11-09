---
layout: article
title:  "Take a Load Off Annie"
date:   2015-11-09
category: musings
tag: "css font weight photoshop bold typography"
excerpt: "Did you know that the font-weight attribute corresponds with the font style control in Photoshop? Font weight isn't just a way to bold things."
class: "CSS"
---
<section class="header">
	<div class="content">
	<div class="span-3 col empty"></div>
	<div class="span-6 col">
		<p class="post-meta">{{ page.date | date: "%b %-d, %Y" }}</p>
		<h1>{{ page.title }}</h1>
		<p>Did you know that the font-weight attribute corresponds with the font style control in Photoshop? Font weight isn't just a way to define how bold something it is. It is a way to harness the variations in professional fonts to maintain some typographic consistency between what is created in Photoshop and what you put on the web. </p>
	</div>
	<div class="span-3 col empty"></div>	
	</div>
</section>
<section class="code continued">
	<div class="content gutters">
	<div class="span-1 col empty"></div>
	<div class="span-6 col">
		<p>Here is how it all maps out.:</p>
		<code>
			font-weight:100; //Thin<br/>
			font-weight:200; //Extra Light<br/>
			font-weight:300; //Light<br/>
			font-weight:400; //Normal, Regular, Roman<br/>
			font-weight:500; //Medium<br/>
			font-weight:600; //Semibold, Demibold<br/>
			font-weight:700; //Bold<br/>
			font-weight:800; //Heavy<br/>
			font-weight:900; //Black
		</code>
	</div>
	<aside class="span-4 col">
		<figure>
			<img src="{{ site.baseurl }}/img/loading.gif" data-src="{{ site.baseurl }}/img/musings/font-weight.png" alt="Photoshop Font"/>
			<figcaption>The Photoshop Font Style toggle is where you go to map to font-weight.</figcaption>
		</figure>
	</aside>	
	<div class="span-1 col empty"></div>	
	</div>
		<div class="divider"></div>	
</section>