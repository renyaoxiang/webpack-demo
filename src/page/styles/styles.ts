import * as $ from "jquery";
import * as scssStyles from "./styles.scss";
import * as cssStyles from "./styles.css";
import { Dom } from "shared/lib/dom";
$(() => {
	$("<div/>", {
		style: {
			height: "200px",
			width: "200px"
		},
		class: scssStyles.outer
	}).appendTo(document.body);
});
