import IconClose from '@assets/icons/icon-close.svg'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from "react"

interface Props {
	text: string
	footnote?: string
	type?: `info` | `success` | `error`
	align?: string
	autohide?: number
}

export default function EiNotification({ text, footnote, type = `info`, align = `global`, autohide }: Props) {
	const [ isShown, setIsShown ] = useState(true)
	const viewMotion = {
		hidden: {
			height: 0,
			margin: 0,
			opacity: 0,
			y: `-16px`
		},
		visible: {
			height: `auto`,
			margin: `4px 0`,
			opacity: 1,
			y: `0`,
			transition: {
				type: `spring`,
				stiffness: 120,
			}
		}
	}

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsShown(false)
		}, autohide)

		return () => clearTimeout(timer)
	}, [ autohide ])

	function closeNotification(ev) {
		if (ev.target === ev.currentTarget) {
			setIsShown(false)
		}
	}

	return (
		<AnimatePresence>
			{isShown && text &&
				<motion.div className={`ei-notification ei-notification-${align} ei-notification-${type}`} variants={viewMotion} initial="hidden" animate="visible" exit="hidden">
					<div className="ei-notification-inner">
						<div className="ei-notification-text">
							<p className="text">{text}</p>
							{footnote &&
								<p className="footnote">{footnote}</p>
							}
						</div>
						<button onClick={(ev) => closeNotification(ev)} className="ei-notification-close link"><i className="icon" role="img"><IconClose className="svg" /></i></button>
					</div>
				</motion.div>
			}
		</AnimatePresence>
	)
}
