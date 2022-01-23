import React from "react";
import ReactDOM from "react-dom";
import { Button, DatePicker } from "antd";
import { devDependencies } from "../../../package.json";

export function Header() {
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
