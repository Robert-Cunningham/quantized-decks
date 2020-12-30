import { alphabetGenerator } from "@quantized/generators/dist/standard/alphabet"
import * as fs from 'fs'
import * as yaml from 'js-yaml'
import { toRomaji, isHiragana, isKatakana } from 'wanakana'
import _ from 'lodash'
import { initDeck, toID, answer_type } from 'quantized'

type Hiragana = string;
type Katakana = string;
type Romaji = string;

const hiragana = yaml.safeLoad(fs.readFileSync("./sources/hiragana.yaml", "utf8")) as Record<Hiragana, Romaji>
const katakana = yaml.safeLoad(fs.readFileSync("./sources/katakana.yaml", "utf8")) as Record<Katakana, Romaji>
const words = yaml.safeLoad(fs.readFileSync("./sources/common_words.yaml", "utf8")) as Hiragana[]
const hiraganaWords = words.filter(x => isHiragana(x))
const katakanaWords = words.filter(x => isKatakana(x))

const hiraganaCharacterCards = alphabetGenerator<Hiragana, Romaji>((x: Hiragana) => hiragana[x], Object.keys(hiragana), []).forward
const katakanaCharacterCards = alphabetGenerator<Katakana, Romaji>((x: Katakana) => katakana[x], Object.keys(katakana), []).forward

const hiraganaWordCards = hiraganaWords.map(w => ({ front: w, back: toRomaji(w) }))
const katakanaWordCards = katakanaWords.map(w => ({ front: w, back: toRomaji(w) }))

const meta = { version: '0.0.1', author: 'Robert Cunningham' }

export const kanaToRomajiID = (kana: string) => `${kana} kana-to-romaji`

const { writeDeck, addCard, deckID } = initDeck('Robert-Cunningham', 'kana', 'Kana', meta)

hiraganaWordCards.forEach((fact) => {
    addCard(fact.front, fact.back, kanaToRomajiID(fact.front), { type: answer_type.text_precise, value: fact.back })
})
katakanaWordCards.forEach((fact) => {
    addCard(fact.front, fact.back, kanaToRomajiID(fact.front), { type: answer_type.text_precise, value: fact.back })
})
hiraganaCharacterCards.forEach((fact) => {
    addCard(fact.front, fact.back, kanaToRomajiID(fact.front), { type: answer_type.text_precise, value: fact.back })
})
katakanaCharacterCards.forEach((fact) => {
    addCard(fact.front, fact.back, kanaToRomajiID(fact.front), { type: answer_type.text_precise, value: fact.back })
})

writeDeck()