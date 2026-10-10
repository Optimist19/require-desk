function PopUp({notice}: {notice: string}) {
	return (
		<div
			role="status"
			className="fixed bottom-5 left-1/2 -translate-x-1/2 rounded-lg bg-slate-950 px-4 py-3 text-sm font-medium text-white shadow-lg capitalize"
		>
			{notice}
		</div>)
}

export default PopUp