import Link from "next/link"
import { ReactElement } from 'react'

interface Props {
	children: ReactElement
	isLoading?: boolean
}

export default function Site({ children, isLoading }: Props) {

	return (
		<div className="site-container">
			<header className="site-header" role="banner">
				<div className="site-header-inner">
					<div className="site-header-logo">
						<Link href="/"><a className="logo">Ei8</a></Link>
					</div>
				</div>
			</header>
			{children}
			<footer id="site-footer" className="site-footer" role="contentinfo">
				<div className="site-footer-inner">
					<div className="site-footer-attribution">
						<p className="copyright">&copy; 2012–2019. Handcrafted by <a href="http://bennyjien.com/" target="_blank" rel="designer noreferrer">Benny Jien</a>.</p>
					</div>
				</div>
			</footer>
		</div>
	)
}