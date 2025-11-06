'use client'

import { useState, useEffect } from 'react'
import { Languages, ArrowLeftRight, Volume2 } from 'lucide-react'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'

interface Language {
  code: string
  name: string
}

export default function TranslationPanel() {
  const [text, setText] = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [sourceLanguage, setSourceLanguage] = useState('auto')
  const [targetLanguage, setTargetLanguage] = useState('en')
  const [languages, setLanguages] = useState<Language[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const data = await api.get('/api/translate/languages')
        setLanguages(data.languages || [])
      } catch (error) {
        console.error('Error fetching languages:', error)
      }
    }
    fetchLanguages()
  }, [])

  const handleTranslate = async () => {
    if (!text.trim()) {
      toast.error('Please enter text to translate')
      return
    }

    setLoading(true)
    try {
      const response = await api.post('/api/translate', {
        text,
        targetLanguage,
        sourceLanguage: sourceLanguage === 'auto' ? undefined : sourceLanguage,
      })
      setTranslatedText(response.translatedText)
    } catch (error) {
      console.error('Translation error:', error)
      toast.error('Failed to translate text')
    } finally {
      setLoading(false)
    }
  }

  const handleSwap = () => {
    const temp = sourceLanguage
    setSourceLanguage(targetLanguage)
    setTargetLanguage(temp)
    setText(translatedText)
    setTranslatedText(text)
  }

  const handleSpeak = (textToSpeak: string, lang: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(textToSpeak)
      utterance.lang = lang
      window.speechSynthesis.speak(utterance)
    } else {
      toast.error('Speech synthesis not supported in your browser')
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Languages className="w-6 h-6 text-primary-600" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          AI Translation
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Source Language */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              From
            </label>
            <select
              value={sourceLanguage}
              onChange={(e) => setSourceLanguage(e.target.value)}
              className="text-sm px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="auto">Auto-detect</option>
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text to translate..."
              className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
            {text && (
              <button
                onClick={() => handleSpeak(text, sourceLanguage === 'auto' ? 'en' : sourceLanguage)}
                className="absolute bottom-2 right-2 p-2 bg-gray-100 dark:bg-gray-600 rounded hover:bg-gray-200 dark:hover:bg-gray-500"
                title="Listen"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Target Language */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              To
            </label>
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="text-sm px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
          <div className="relative">
            <textarea
              value={translatedText}
              readOnly
              placeholder="Translation will appear here..."
              className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white resize-none"
            />
            {translatedText && (
              <button
                onClick={() => handleSpeak(translatedText, targetLanguage)}
                className="absolute bottom-2 right-2 p-2 bg-gray-100 dark:bg-gray-600 rounded hover:bg-gray-200 dark:hover:bg-gray-500"
                title="Listen"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-6 flex items-center justify-center space-x-4">
        <button
          onClick={handleSwap}
          className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          title="Swap languages"
        >
          <ArrowLeftRight className="w-5 h-5" />
        </button>
        <button
          onClick={handleTranslate}
          disabled={loading || !text.trim()}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Translating...' : 'Translate'}
        </button>
      </div>
    </div>
  )
}

