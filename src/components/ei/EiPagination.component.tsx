import IconChevronLeft from '@assets/icons/icon-chevron-left.svg'
import IconChevronRight from '@assets/icons/icon-chevron-right.svg'
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react"

interface Props {
	count: number
	countPerPage: number
	currentPage: number
	setCurrentPage: Dispatch<SetStateAction<number>>
}

export default function EiPagination({ count, countPerPage, currentPage = 1, setCurrentPage }: Props) {
	const [ activePage, setActivePage ] = useState([])

	// Total pages to be shown on the center of pagination
	const PAGE_RANGE = 3
	const lastPage = useMemo(() => Math.ceil(count / countPerPage), [ count, countPerPage ])
	const showingFrom = useMemo(() => (currentPage - 1) * countPerPage + 1, [ currentPage, countPerPage ])
	const showingTo = useMemo(() => currentPage * countPerPage, [ currentPage, countPerPage ])

	useEffect(() => {
		const allPage = Array.from({ length: lastPage }, (_, i) => i + 1)
		const activeArr = [ 1 ]

		if (lastPage > 1) {
			activeArr.push(lastPage)
		}

		if (allPage.length > 2) {
			if (currentPage <= PAGE_RANGE) {
				for (let i = 0; i < PAGE_RANGE; i++) {
					if (i + 2 < lastPage) {
						activeArr.splice(i + 1, 0, i + 2)
					}
				}
			} else if (currentPage + PAGE_RANGE <= lastPage) {
				for (let i = 0; i < PAGE_RANGE; i++) {
					activeArr.splice(i + 1, 0, currentPage - 1 + i)
				}
			} else {
				for (let i = 0; i < PAGE_RANGE; i++) {
					if (lastPage - PAGE_RANGE + i > 1) {
						activeArr.splice(-1, 0, lastPage - PAGE_RANGE + i)
					}
				}
			}
		}

		setActivePage(activeArr)
	}, [ lastPage, currentPage ])

	return (
		<div className="ei-pagination">
			<p className="ei-pagination-counter">Showing {showingFrom} – {showingTo} of {count}</p>
			<div className="ei-pagination-nav">
				<div className="ei-pagination-prev">
					<button
						type="button"
						onClick={() => {
							setCurrentPage(currentPage - 1)
						}}
						className="link"
						disabled={currentPage === 1}
					>
						<i className="icon" role="img"><IconChevronLeft className="svg" /></i>
						Prev
					</button>
				</div>
				<div className="ei-pagination-list">
					<ul className="items">
						{activePage.map(i =>
							<li key={`pagenav-${i}`} className="item">
								<button
									type="button"
									onClick={() => {
										setCurrentPage(i)
									}}
									className={`link ${currentPage === i ? `is-current` : ``}`}
								>
									{i}
								</button>
							</li>
						)}
					</ul>
				</div>
				<div className="ei-pagination-next">
					<button
						type="button"
						onClick={() => {
							setCurrentPage(currentPage + 1)
						}}
						className="link"
						disabled={currentPage === lastPage}
					>
						Next
						<i className="icon" role="img"><IconChevronRight className="svg" /></i>
					</button>
				</div>
			</div>
		</div>
	)
}
