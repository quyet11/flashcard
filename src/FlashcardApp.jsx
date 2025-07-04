import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function FlashcardApp() {
    const [cards, setCards] = useState([]);
    const [index, setIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [newWord, setNewWord] = useState("");
    const [newMeaning, setNewMeaning] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [isQuizMode, setIsQuizMode] = useState(false);


    // Load từ localStorage khi mở app
    useEffect(() => {
        const saved = localStorage.getItem("flashcard-words");
        if (saved) {
            setCards(JSON.parse(saved));
        }
    }, []);

    // Lưu vào localStorage mỗi khi thay đổi danh sách
    useEffect(() => {
        localStorage.setItem("flashcard-words", JSON.stringify(cards));
    }, [cards]);

    const nextCard = () => {
        setFlipped(false);
        setIndex((index + 1) % cards.length);
    };

    const prevCard = () => {
        setFlipped(false);
        setIndex((index - 1 + cards.length) % cards.length);
    };

    const addCard = () => {
        if (newWord && newMeaning) {
            const newCard = { id: Date.now(), word: newWord, meaning: newMeaning };
            setCards([...cards, newCard]);
            setNewWord("");
            setNewMeaning("");
        }
    };
    const deleteCard = (id) => {
        const updated = cards.filter(card => card.id !== id);
        setCards(updated);

        // Cập nhật index để tránh lỗi khi xóa phần tử cuối
        if (index >= updated.length) {
            setIndex(updated.length - 1);
        }
        setFlipped(false);
    };




    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 flex flex-col items-center justify-center p-6">
            {isQuizMode ? (
                <QuizMode cards={cards} onExit={() => setIsQuizMode(false)} />
            ) : (
                <>
                    <h1 className="text-4xl font-bold mb-6">🎓 English Flashcards</h1>

                    {cards.length > 0 && (
                        <Button
                            onClick={() => setIsQuizMode(true)}
                            className="mb-4 bg-green-600 hover:bg-green-700 text-white"
                        >
                            🧠 Luyện tập
                        </Button>
                    )}

                    {cards.length > 0 && (
                        <Button onClick={() => setShowModal(true)} className="mb-4">
                            📚 Danh sách từ đã thêm
                        </Button>
                    )}

                    {showModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6 max-h-[80vh] overflow-y-auto">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold">📘 Từ đã thêm</h2>
                                    <button onClick={() => setShowModal(false)} className="text-xl text-gray-500 hover:text-gray-700">❌</button>
                                </div>
                                {cards.length === 0 ? (
                                    <p className="text-sm text-gray-600">Bạn chưa thêm từ nào.</p>
                                ) : (
                                    <>
                                        <div className="space-y-2">
                                            {cards.map((card) => (
                                                <div key={card.id} className="flex justify-between items-center border-b pb-2">
                                                    <div className="text-sm font-medium">{card.word} - {card.meaning}</div>
                                                    <button
                                                        onClick={() => deleteCard(card.id)}
                                                        className="text-red-500 hover:text-red-700 text-base px-2"
                                                    >
                                                        🗑 Xoá
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => {
                                                setCards([]);
                                                setShowModal(false);
                                            }}
                                            className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded"
                                        >
                                            🧹 Xoá tất cả
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col md:flex-row gap-2 mb-4 w-full max-w-md">
                        <Input
                            placeholder="Từ vựng"
                            value={newWord}
                            onChange={(e) => setNewWord(e.target.value)}
                        />
                        <Textarea
                            placeholder="Nghĩa tiếng Việt"
                            value={newMeaning}
                            onChange={(e) => setNewMeaning(e.target.value)}
                        />
                        <Button
                            onClick={addCard}
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                            Thêm
                        </Button>
                    </div>

                    {cards.length > 0 && (
                        <div className="relative w-full max-w-md h-64 mb-6 perspective">
                            <Card className="w-full h-full relative shadow-xl bg-white">

                                {/* Số thứ tự góc trên trái */}
                                <div className="absolute top-2 left-2 z-10 bg-white bg-opacity-80 px-2 py-1 rounded text-sm font-semibold text-gray-700 shadow">
                                    📄 {index + 1} / {cards.length}
                                </div>

                                {/* Nút xoá góc phải */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteCard(cards[index].id);
                                    }}
                                    className="absolute top-2 right-2 z-10 text-red-500 hover:text-red-700 text-sm bg-white px-2 py-1 rounded shadow"
                                >
                                    🗑 Xoá
                                </button>

                                {/* Nội dung có hiệu ứng lật */}
                                <div
                                    onClick={() => setFlipped(!flipped)}
                                    className={`w-full h-full relative transition-transform duration-700 transform-style preserve-3d ${flipped ? "rotate-y-180" : ""}`}
                                >
                                    <div className="absolute w-full h-full backface-hidden flex items-center justify-center text-2xl font-semibold p-4">
                                        {cards[index].word}
                                    </div>
                                    <div className="absolute w-full h-full backface-hidden rotate-y-180 flex items-center justify-center text-2xl font-semibold p-4">
                                        {cards[index].meaning}
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}


                    {cards.length > 0 && (
                        <div className="flex space-x-4">
                            <Button onClick={prevCard} variant="outline">← Trước</Button>
                            <Button onClick={nextCard} variant="outline">Tiếp →</Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );

}
function QuizMode({ cards, onExit }) {
    const [answers, setAnswers] = useState(cards.map(() => ""));
    const [submitted, setSubmitted] = useState(false);

    const correctCount = answers.filter((a, i) =>
        a.trim().toLowerCase() === cards[i].word.toLowerCase()
    ).length;

    return (
        <div className="w-full max-w-xl bg-white rounded-xl shadow-xl p-6 text-center space-y-4">
            <div className="w-full flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-purple-700">📝 Kiểm tra từ vựng</h2>
                <button
                    onClick={onExit}
                    className="text-gray-500 hover:text-red-500 text-xl transition-transform hover:scale-110"
                >
                    ❌
                </button>
            </div>



            <div className="space-y-4 max-h-[65vh] overflow-y-auto px-2">

                {cards.map((card, i) => (

                    <div key={card.id} className="bg-purple-100 p-4 rounded-lg shadow-sm text-left">

                        <p className="font-medium mb-2 text-gray-700">🇻🇳 {card.meaning}</p>
                        <Input
                            disabled={submitted}
                            placeholder="Nhập tiếng Anh..."
                            value={answers[i]}
                            onChange={(e) => {
                                const newAns = [...answers];
                                newAns[i] = e.target.value;
                                setAnswers(newAns);
                            }}
                        />
                        {submitted && (
                            <p className={`mt-2 text-sm font-semibold ${answers[i].trim().toLowerCase() === card.word.toLowerCase() ? "text-green-600" : "text-red-500"}`}>
                                {answers[i].trim().toLowerCase() === card.word.toLowerCase()
                                    ? "✔️ Chính xác"
                                    : `❌ Sai, đáp án: ${card.word}`}
                            </p>
                        )}
                    </div>
                ))}
            </div>

            {!submitted ? (
                <Button
                    onClick={() => setSubmitted(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                >
                    ✅ Nộp bài
                </Button>
            ) : (
                <>
                    <p className="text-xl font-semibold text-purple-800">
                        🎯 Bạn đúng {correctCount}/{cards.length} từ!
                    </p>

                    {correctCount === cards.length && (
                        <div className="text-2xl mt-2 animate-bounce text-pink-600">
                            🎆 Quá đỉnh! Made by Quyetdz 🎆
                        </div>
                    )}

                    <Button
                        onClick={onExit}
                        className="mt-4 bg-gray-500 hover:bg-gray-600 text-white w-full"
                    >
                        ↩️ Quay lại học
                    </Button>
                </>
            )}
        </div>
    );
}
