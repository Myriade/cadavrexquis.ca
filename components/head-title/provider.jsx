"use client";

import { createContext, useState, useContext } from "react";

const HeadTitleContext = createContext({
	title: "",
	setTitle: () => {},
});

export const HeadTitleProvider = ({ children }) => {
	const [title, setTitle] = useState("");
	
	return (
		<HeadTitleContext.Provider value={{ title, setTitle }}>
			{children}
		</HeadTitleContext.Provider>
	);
};

export const useHeadTitle = () => useContext(HeadTitleContext);

export const HeadTitle = () => {
	const { title } = useContext(HeadTitleContext);
	if (!title) return null;
	return <title>{title}</title>;
};