import React from 'react';
import styles from './DemoExpenseList.module.scss';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';

function DemoExpenseList() {
	const demoLumberItems = [
		{ name: 'Table Top Panel', species: 'Walnut', thickness: 1.5, boardFeet: 12.75, cost: 245.56 },
		{ name: 'Table Legs', species: 'Walnut', thickness: 1.5, boardFeet: 3.33, cost: 64.14 },
		{ name: 'Table Stretchers', species: 'Walnut', thickness: 1, boardFeet: 2.78, cost: 56.49 },
	];

	const genericExpenseItems = [{ name: 'z-clips', amount: 6, cost: 0.65 }];
	return (
		<div className={styles.DemoExpenseList}>
			<div className={styles.container}>
				<div className={styles.categoryContainer}>
					<div className={styles.flexGroup}>
						<h4 className={styles.category}>Project Expenses</h4>
						<p className={styles.categoryDescription}>Lumber and Project-specific costs</p>
					</div>
					{/* <button className={styles.addButton}>Add Expense</button>
				<button className={styles.mobileAddButton}>
					<FontAwesomeIcon icon={faPlus} className={styles.addIcon} />
				</button> */}
				</div>
				<div className={styles.list}>
					{demoLumberItems.map((i) => (
						<DemoLumberItem {...i} key={i.name} />
					))}

					{genericExpenseItems.map((i) => (
						<DemoGeneralExpenseItem {...i} key={i.name} />
					))}
				</div>
			</div>
		</div>
	);
}

// Mock Lumber Items

type DemoLumberItemType = {
	name: string;
	species: string;
	thickness: number;
	boardFeet: number;
	cost: number;
};

function DemoLumberItem({ name, species, thickness, boardFeet, cost }: DemoLumberItemType) {
	return (
		<div className={styles.itemContainer}>
			<h2 className={styles.itemname}>{name}</h2>
			<div className={styles.itemFlexContainer}>
				<div className={styles.itemSpeciesThicknessGroup}>
					<p className={styles.itemSpecies}>{species}</p>
					<p className={styles.itemThickness}>
						{thickness}
						{`"`} thick
					</p>
				</div>
				<p className={styles.itemBoardFeet}>{boardFeet} BF</p>
				<p className={styles.itemCost}>${cost}</p>
			</div>
			{/* <div className={styles.itemButtonGroup}>
				<button className={styles.itemIconEditButton} title='edit'>
					<FontAwesomeIcon icon={faPenToSquare} className={styles.itemEditIcon} />
				</button>
				<button className={styles.itemIconDeleteButton} title='delete'>
					<FontAwesomeIcon icon={faTrashCan} className={styles.itemDeleteIcon} />
				</button>
			</div> */}
		</div>
	);
}

function DemoGeneralExpenseItem({ amount, name, cost }: { amount: number; name: string; cost: number }) {
	return (
		<div className={styles.genericContainer}>
			<div className={styles.genericFlexContainer}>
				<div className={styles.genericListItemContainer}>
					<p className={styles.genericListItem}>{amount}</p>
				</div>
				<div className={`${styles.genericListItemContainer} ${styles.flexGrow}`}>
					<p className={styles.genericListItem}>{name}</p>
				</div>
				<div className={styles.genericListItemContainer}>
					<p className={styles.genericListItem}>
						${cost} <br /> /each
					</p>
				</div>
				<div className={styles.genericListItemContainer}>
					<p className={styles.genericListItem}>${(amount * cost).toFixed(2)}</p>
				</div>
			</div>
			{/* <div className={styles.buttonGroup}>
				<button onClick={() => setIsEditingExpense(true)} className={styles.iconEditButton} title='edit'>
					<FontAwesomeIcon icon={faPenToSquare} className={styles.editIcon} />
				</button>
				<button
					onClick={handleDelete}
					disabled={deleteExpense.isLoading}
					className={styles.iconDeleteButton}
					title='delete'
				>
					<FontAwesomeIcon icon={faTrashCan} className={styles.deleteIcon} />
				</button>
			</div> */}
		</div>
	);
}

export default DemoExpenseList;
