import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { Button, DatePicker } from "antd";
import { devDependencies } from "../../../package.json";
import axios from "axios";

export function Header() {
	useEffect(() => {
		const getData = async () => {
			const { data } = await axios.get("/api/menu");
			console.log(data);
		};
		const postOriginData = async () => {
			const { data } = await axios.post("/api/res", { title: "标题" });
			console.log(data);
		};
		const postRawData = async () => {
			const { data } = await axios.post("/api/text", { a: 111 });
			console.log(data);
		};
		const invokeMockRequest = async () => {
			await getData();
			await postOriginData();
			await postRawData();
		};
		const invokeProxyRequest = async () => {
			const data = await axios.get("/api/toplist");
			console.log(data);
		};
		// invokeMockRequest();
		invokeProxyRequest();
	}, []);
	return (
		<div className="p-20px text-center">
			<h1 className="font-bold text-2xl mb-2">
				vite version: {devDependencies.vite}
			</h1>
			<DatePicker />
			<Button type="primary" className="ml-2">
				Primary Button
			</Button>
		</div>
	);
}
