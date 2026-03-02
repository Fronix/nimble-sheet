import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
	Alert,
	Modal,
	SafeAreaView,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { SPELL_MAP, SPELLS } from "../../../src/data/spells";
import { useCharacterStore } from "../../../src/store/characterStore";
import type { SpellSchool } from "../../../src/types/character";

const SCHOOLS: (SpellSchool | "All")[] = [
	"All",
	"Arcane",
	"Divine",
	"Druidic",
	"Elemental",
	"Illusion",
	"Necromancy",
];
const SCHOOL_COLORS: Record<SpellSchool, string> = {
	Arcane: "#4A7FBF",
	Divine: "#C9A84C",
	Druidic: "#3D7A3D",
	Elemental: "#C23535",
	Illusion: "#7A4A9A",
	Necromancy: "#4A4A4A",
};

export default function SpellsScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const character = useCharacterStore((s) => Object.values(s.characters)[0]);
	const store = useCharacterStore();
	const [filter, setFilter] = useState<SpellSchool | "All">("All");
	const [pickerVisible, setPickerVisible] = useState(false);

	console.log(id);
	if (!character) return <Text>Not found</Text>;

	const knownSpells = character.knownSpells
		.map((sid) => SPELL_MAP[sid])
		.filter(Boolean);
	const filteredKnown =
		filter === "All"
			? knownSpells
			: knownSpells.filter((s) => s.school === filter);

	const availableToLearn = SPELLS.filter(
		(s) =>
			!character.knownSpells.includes(s.id) &&
			(filter === "All" || s.school === filter),
	);

	function handleCast(spellId: string) {
		const spell = SPELL_MAP[spellId];
		if (!spell) return;
		if (character.mana.current < spell.level) {
			Alert.alert(
				"Not Enough Mana",
				`${spell.name} costs ${spell.level} mana but you only have ${character.mana.current}.`,
			);
			return;
		}
		Alert.alert(
			`Cast ${spell.name}?`,
			`Costs ${spell.level} mana point${spell.level !== 1 ? "s" : ""}.`,
			[
				{ text: "Cancel", style: "cancel" },
				{ text: "Cast", onPress: () => store.adjustMana(id, -spell.level) },
			],
		);
	}

	function handleLearn(spellId: string) {
		store.updateCharacter(id, {
			knownSpells: [...character.knownSpells, spellId],
		});
		setPickerVisible(false);
	}

	function handleForget(spellId: string) {
		const spell = SPELL_MAP[spellId];
		Alert.alert(
			"Forget Spell?",
			`Remove ${spell?.name} from your known spells?`,
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Forget",
					style: "destructive",
					onPress: () =>
						store.updateCharacter(id, {
							knownSpells: character.knownSpells.filter((s) => s !== spellId),
						}),
				},
			],
		);
	}

	return (
		<View style={{ flex: 1, backgroundColor: "#1A1A2E" }}>
			<SafeAreaView style={{ flex: 1 }}>
				{/* Mana bar */}
				<View
					style={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 6 }}
				>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
							marginBottom: 4,
						}}
					>
						<Text
							style={{
								fontFamily: "CinzelDecorative-Regular",
								fontSize: 10,
								color: "#4A7FBF",
								textTransform: "uppercase",
								letterSpacing: 1,
							}}
						>
							Mana
						</Text>
						<Text
							style={{
								fontFamily: "CinzelDecorative-Regular",
								fontSize: 14,
								color: "#7AAAD6",
							}}
						>
							{character.mana.current} / {character.mana.max}
						</Text>
					</View>
					<View
						style={{
							height: 8,
							backgroundColor: "#2D2D44",
							borderRadius: 4,
							overflow: "hidden",
						}}
					>
						<View
							style={{
								height: "100%",
								width:
									character.mana.max > 0
										? `${(character.mana.current / character.mana.max) * 100}%`
										: "0%",
								backgroundColor: "#4A7FBF",
								borderRadius: 4,
							}}
						/>
					</View>
					<View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
						<TouchableOpacity
							onPress={() => store.adjustMana(id, -1)}
							style={{
								flex: 1,
								backgroundColor: "#2D2D44",
								borderColor: "#4A7FBF",
								borderWidth: 1,
								borderRadius: 6,
								padding: 6,
								alignItems: "center",
							}}
						>
							<Text
								style={{
									color: "#4A7FBF",
									fontFamily: "IMFellEnglish-Regular",
								}}
							>
								− Mana
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => store.adjustMana(id, 1)}
							style={{
								flex: 1,
								backgroundColor: "#2D2D44",
								borderColor: "#4A7FBF",
								borderWidth: 1,
								borderRadius: 6,
								padding: 6,
								alignItems: "center",
							}}
						>
							<Text
								style={{
									color: "#4A7FBF",
									fontFamily: "IMFellEnglish-Regular",
								}}
							>
								+ Mana
							</Text>
						</TouchableOpacity>
					</View>
				</View>

				{/* School filter tabs */}
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={{
						paddingHorizontal: 12,
						paddingVertical: 8,
						gap: 6,
					}}
				>
					{SCHOOLS.map((school) => {
						const color = school === "All" ? "#C9A84C" : SCHOOL_COLORS[school];
						return (
							<TouchableOpacity
								key={school}
								onPress={() => setFilter(school)}
								style={{
									paddingHorizontal: 12,
									paddingVertical: 5,
									borderRadius: 12,
									borderWidth: 1,
									borderColor: color,
									backgroundColor:
										filter === school ? color + "33" : "transparent",
								}}
							>
								<Text
									style={{
										color,
										fontFamily: "CinzelDecorative-Regular",
										fontSize: 9,
										textTransform: "uppercase",
									}}
								>
									{school}
								</Text>
							</TouchableOpacity>
						);
					})}
				</ScrollView>

				<ScrollView contentContainerStyle={{ padding: 14, paddingBottom: 80 }}>
					{/* Known spells */}
					{filteredKnown.length === 0 ? (
						<Text
							style={{
								fontFamily: "IMFellEnglish-Italic",
								fontSize: 13,
								color: "#5A5A7A",
								textAlign: "center",
								marginVertical: 20,
							}}
						>
							{character.knownSpells.length === 0
								? "No spells known. Tap + to learn spells."
								: "No spells in this school."}
						</Text>
					) : (
						filteredKnown.map((spell) => {
							const color = SCHOOL_COLORS[spell.school];
							return (
								<View
									key={spell.id}
									style={{
										backgroundColor: "#2D2D44",
										borderColor: color + "66",
										borderWidth: 1,
										borderRadius: 10,
										padding: 12,
										marginBottom: 8,
									}}
								>
									<View
										style={{
											flexDirection: "row",
											justifyContent: "space-between",
											alignItems: "center",
											marginBottom: 4,
										}}
									>
										<View style={{ flex: 1 }}>
											<Text
												style={{
													fontFamily: "CinzelDecorative-Regular",
													fontSize: 13,
													color: "#F5E6C8",
												}}
											>
												{spell.name}
											</Text>
											<Text
												style={{
													fontFamily: "IMFellEnglish-Regular",
													fontSize: 10,
													color,
												}}
											>
												{spell.school} · Level {spell.level} ·{" "}
												{spell.castingTime} · {spell.range}
											</Text>
										</View>
										<View
											style={{
												alignItems: "center",
												backgroundColor: color + "22",
												borderRadius: 6,
												padding: 6,
												marginLeft: 8,
											}}
										>
											<Text
												style={{
													color,
													fontFamily: "CinzelDecorative-Bold",
													fontSize: 16,
												}}
											>
												{spell.level}
											</Text>
											<Text
												style={{
													color,
													fontFamily: "CinzelDecorative-Regular",
													fontSize: 7,
												}}
											>
												MANA
											</Text>
										</View>
									</View>
									<Text
										style={{
											fontFamily: "IMFellEnglish-Regular",
											fontSize: 12,
											color: "#C4A96A",
											marginBottom: 8,
										}}
									>
										{spell.description}
									</Text>
									<View style={{ flexDirection: "row", gap: 8 }}>
										{character.mana.max > 0 && (
											<TouchableOpacity
												onPress={() => handleCast(spell.id)}
												style={{
													flex: 1,
													backgroundColor: color + "33",
													borderColor: color,
													borderWidth: 1,
													borderRadius: 6,
													padding: 6,
													alignItems: "center",
												}}
											>
												<Text
													style={{
														color,
														fontFamily: "CinzelDecorative-Regular",
														fontSize: 10,
														textTransform: "uppercase",
													}}
												>
													Cast
												</Text>
											</TouchableOpacity>
										)}
										<TouchableOpacity
											onPress={() => handleForget(spell.id)}
											style={{
												backgroundColor: "#1A1A2E",
												borderColor: "#5A5A7A",
												borderWidth: 1,
												borderRadius: 6,
												paddingVertical: 6,
												paddingHorizontal: 10,
												alignItems: "center",
											}}
										>
											<Text
												style={{
													color: "#5A5A7A",
													fontFamily: "IMFellEnglish-Regular",
													fontSize: 11,
												}}
											>
												Forget
											</Text>
										</TouchableOpacity>
									</View>
								</View>
							);
						})
					)}
				</ScrollView>

				{/* Add spell FAB */}
				<TouchableOpacity
					onPress={() => setPickerVisible(true)}
					style={{
						position: "absolute",
						bottom: 70,
						right: 18,
						width: 50,
						height: 50,
						borderRadius: 25,
						backgroundColor: "#4A7FBF",
						alignItems: "center",
						justifyContent: "center",
						shadowColor: "#000",
						shadowOffset: { width: 0, height: 3 },
						shadowOpacity: 0.4,
						shadowRadius: 6,
						elevation: 6,
					}}
				>
					<Text
						style={{
							fontSize: 26,
							color: "#F5E6C8",
							lineHeight: 30,
							marginTop: -2,
						}}
					>
						+
					</Text>
				</TouchableOpacity>

				{/* Spell Picker Modal */}
				<Modal
					visible={pickerVisible}
					transparent
					animationType="slide"
					onRequestClose={() => setPickerVisible(false)}
				>
					<TouchableOpacity
						style={{ flex: 1, backgroundColor: "#00000088" }}
						onPress={() => setPickerVisible(false)}
					/>
					<View
						style={{
							backgroundColor: "#1A1A2E",
							borderTopColor: "#4A7FBF",
							borderTopWidth: 1,
							padding: 16,
							maxHeight: "70%",
						}}
					>
						<Text
							style={{
								fontFamily: "CinzelDecorative-Bold",
								fontSize: 14,
								color: "#4A7FBF",
								marginBottom: 12,
							}}
						>
							Learn a Spell
						</Text>
						<ScrollView>
							{availableToLearn.map((spell) => {
								const color = SCHOOL_COLORS[spell.school];
								return (
									<TouchableOpacity
										key={spell.id}
										onPress={() => handleLearn(spell.id)}
										style={{
											paddingVertical: 10,
											borderBottomColor: "#3D3D58",
											borderBottomWidth: 1,
										}}
									>
										<View
											style={{
												flexDirection: "row",
												justifyContent: "space-between",
											}}
										>
											<Text
												style={{
													fontFamily: "CinzelDecorative-Regular",
													fontSize: 12,
													color: "#F5E6C8",
												}}
											>
												{spell.name}
											</Text>
											<Text
												style={{
													fontFamily: "IMFellEnglish-Regular",
													fontSize: 10,
													color,
												}}
											>
												Lv{spell.level} {spell.school}
											</Text>
										</View>
										<Text
											style={{
												fontFamily: "IMFellEnglish-Italic",
												fontSize: 11,
												color: "#7A6050",
												marginTop: 2,
											}}
										>
											{spell.description.slice(0, 80)}…
										</Text>
									</TouchableOpacity>
								);
							})}
						</ScrollView>
					</View>
				</Modal>
			</SafeAreaView>
		</View>
	);
}
