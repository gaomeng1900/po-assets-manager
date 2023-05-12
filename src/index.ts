/**
 * Copyright (C) 2021 Alibaba Group Holding Limited
 * All rights reserved.
 */

import * as DIMBIN from 'dimbin'

export type AssetInfo = {
	id: string // asset id
	// type: 'text' | 'binary'
	// mime: string // used for generating DataURI
	name: string // asset name (without extension and location)
	dir: string // asset path @default '/'
	ext: string // asset extension
	isStatic: boolean // whether this is a static asset
}

export interface Asset {
	info: AssetInfo
	data: Uint8Array
}

type MetaData = {
	version: '0'
}

/**
 * @Layout
 * [
 * 		[MetaData], // json
 * 		AssetInfo[], // json
 * 		TypedArray[] // data
 * ]
 */

/**
 * package files into a single binary
 */
export function pack(assets: Asset[]): ArrayBuffer {
	const meta: MetaData = {
		version: '0',
	}
	const metaArray = [DIMBIN.stringsSerialize([JSON.stringify(meta)])]
	const infos = assets.map((a) => JSON.stringify(a.info))
	const infoArray = [DIMBIN.stringsSerialize(infos)]
	const dataArray = assets.map((a) => a.data)

	const result = DIMBIN.serialize([metaArray, infoArray, dataArray])

	return result
}

/**
 * unpack binary to assets
 */
export function unpack(bin: ArrayBuffer): Asset[] {
	const [metaArray, infoArray, dataArray] = DIMBIN.parse(bin) as [
		Uint8Array[],
		Uint8Array[],
		Uint8Array[]
	]

	const meta = JSON.parse(DIMBIN.stringsParse(metaArray[0])[0])

	const infos = DIMBIN.stringsParse(infoArray[0]).map((string) => JSON.parse(string)) as AssetInfo[]

	const assets = infos.map((info, index) => {
		const data = dataArray[index]

		const asset = {
			info,
			data,
		} as Asset

		return asset
	})

	return assets
}

/**
 *
 */
export class AssetReader {
	private _assets: Asset[]
	private _meta: MetaData

	constructor() {}

	useAssetPack(pack: ArrayBuffer) {}
	useNetwork(root: string) {}
	// useLocalFS

	// async list() {}
	async get(path: string) {}
	async getByID(id: string) {}
	async getByPath(path: string) {}

	// async isDir() {}
	// async isFile() {}
}
