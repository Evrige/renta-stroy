'use client'
import React from 'react';
import {useRouter} from "next/navigation";
import {CircleArrowLeft} from "lucide-react";

const BackButton = () => {
	const router = useRouter();
	return (
		<CircleArrowLeft size={24} color="#181a20" onClick={() => router.back()} className="cursor-pointer"/>
	);
};

export default BackButton;
