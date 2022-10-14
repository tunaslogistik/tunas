export const heightMotion = {
	hidden: {
		height: 0,
		opacity: 0,
		overflow: `hidden`,
		transition: {
			type: `tween`,
			ease: `easeInOut`,
			duration: 0.2
		}
	},
	visible: {
		height: `auto`,
		opacity: 1,
		overflow: `hidden`,
		transition: {
			type: `tween`,
			ease: `easeInOut`,
			duration: 0.2
		}
	}
}

export const slideUpMotion = {
	hidden: {
		y: `25%`,
		opacity: 0,
		transition: {
			type: `tween`,
			ease: `easeInOut`,
			duration: 0.2
		}
	},
	visible: {
		y: 0,
		opacity: 1,
		transition: {
			type: `tween`,
			ease: `easeInOut`,
			duration: 0.2
		}
	}
}

export const slideDownMotion = {
	hidden: {
		y: `-25%`,
		opacity: 0,
		transition: {
			type: `tween`,
			ease: `easeInOut`,
			duration: 0.2
		}
	},
	visible: {
		y: 0,
		opacity: 1
	}
}

export const slideLeftMotion = {
	hidden: {
		x: `25%`,
		opacity: 0,
		transition: {
			type: `tween`,
			ease: `easeInOut`,
			duration: 0.2
		}
	},
	visible: {
		x: 0,
		opacity: 1,
		transition: {
			type: `tween`,
			ease: `easeInOut`,
			duration: 0.2
		}
	}
}