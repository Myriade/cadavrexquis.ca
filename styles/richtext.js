export default function richTextCss() {
	return `
		p, ul, ol {
			margin-bottom: 1em;}
			
		h2, h3 {
			margin-block: 1.5em 0.25em}
		
		ul {
			margin-left: 1em;
			list-style-type: circle;}
			
		ol {
			margin-left: 2em;
			list-style-type: number;}
			
		a {
			text-decoration: underline;
			&:hover {
				background-color: var(--color-grispale);}}
				
		blockquote {
			border-left: 4px solid var(--color-grispale);
			padding-left: 1em;}
			
		figure.caption-img {
			display: table;
			width: max-content;}
		
		figure.caption-img img {
			display: block;}
		
		figure.caption-img figcaption {
			display: table-caption;
			caption-side: bottom;
			padding: 0.5em 0;
			font-size: 0.9em;}
			
		figure.align-left {
			float: left;
			margin-right: 1.5em;}
		
		figure.align-right {
			float: right;
			margin-left: 1.5em;}
			
		figure.align-center {
			margin-inline: auto;
		}
	`
}