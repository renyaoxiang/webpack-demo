const isReady: Promise<any> = new Promise((resolve, reject) => {
	document.addEventListener("DOMContentLoaded", () => {
		resolve();
	});
});

export class Dom {
	public static onReady(): Promise<any> {
		return isReady;
	}
}
