/**
 * 模組註冊表測試頁面
 */

"use client";

import { useState } from "react";
import {
    getCategories,
    getModulesByCategory,
    getCategoryModuleCount,
} from "@/lib/component-registry";

export default function TestRegistryPage() {
    const categories = getCategories();
    const [openCategories, setOpenCategories] = useState<Set<string>>(
        new Set(categories.map((c) => c.id)), // 預設全部展開
    );

    const toggleCategory = (categoryId: string) => {
        setOpenCategories((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(categoryId)) {
                newSet.delete(categoryId);
            } else {
                newSet.add(categoryId);
            }
            return newSet;
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto p-8 max-w-6xl">
                <div className="space-y-3">
                    {categories.map((category) => {
                        const modules = getModulesByCategory(category.id);
                        const count = getCategoryModuleCount(category.id);
                        const isOpen = openCategories.has(category.id);

                        // 只顯示有模組的分類
                        if (count === 0) return null;

                        return (
                            <div
                                key={category.id}
                                className="bg-white rounded-lg border overflow-hidden"
                            >
                                {/* 分類標題 - 可點擊展開/收合 */}
                                <button
                                    onClick={() => toggleCategory(category.id)}
                                    className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
                                >
                                    {/* 展開/收合圖示 */}
                                    <svg
                                        className={`w-5 h-5 text-gray-500 transition-transform ${
                                            isOpen ? "rotate-90" : ""
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>

                                    <span className="text-2xl">
                                        {category.icon}
                                    </span>
                                    <div className="flex-1 text-left">
                                        <h2 className="text-lg font-semibold text-gray-900">
                                            {category.name}
                                        </h2>
                                        {category.description && (
                                            <p className="text-sm text-gray-500">
                                                {category.description}
                                            </p>
                                        )}
                                    </div>
                                    <span className="text-sm text-gray-400 font-medium">
                                        {count} 個模組
                                    </span>
                                </button>

                                {/* 模組網格 - 可展開/收合 */}
                                {isOpen && (
                                    <div className="border-t p-6 bg-gray-50">
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                            {modules.map((module) => (
                                                <div
                                                    key={module.id}
                                                    className="group relative flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all cursor-move bg-white"
                                                    draggable
                                                    onDragStart={(e) => {
                                                        e.dataTransfer.setData(
                                                            "application/json",
                                                            JSON.stringify({
                                                                type: "module",
                                                                moduleId:
                                                                    module.id,
                                                            }),
                                                        );
                                                        e.dataTransfer.effectAllowed =
                                                            "copy";
                                                    }}
                                                >
                                                    {/* 圖示 */}
                                                    <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">
                                                        {module.icon}
                                                    </div>

                                                    {/* 標籤 */}
                                                    <div className="text-center">
                                                        <div className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                                                            {module.label}
                                                        </div>
                                                        <div className="text-xs text-gray-400 mt-1">
                                                            {module.id}
                                                        </div>
                                                    </div>

                                                    {/* Hover 提示 */}
                                                    <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity pointer-events-none" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
