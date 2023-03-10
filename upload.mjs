import fetch from "node-fetch";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import config from "./config.mjs";

await uploadFiles();

async function uploadFiles(dir = "./src/N-EXT", parentFolderId = false) {
	const files = await fs.readdir(dir);
	const folderName = dir.match(/(\w+)$/)[1];
	let folderId = await getFolderId(folderName, parentFolderId);
	if (!folderId) {
		folderId = createFolder(folderName, parentFolderId);
	}
	if (!folderId) {
		console.error(`Couldn't get or create folder ${dir}`);
		return;
	}

	for (const fileName of files) {
		const path = `${dir}/${fileName}`;
		if ((await fs.stat(path)).isDirectory()) {
			await uploadFiles(path, folderId);
		} else {
			const fileContents = await fs.readFile(path, { encoding: "base64" });
			await uploadFile(fileName, fileContents, folderId);
		}
	}
}

async function createFolder(name, parentId) {
	const response = await sendRequest(
		"add",
		`<platformMsgs:add>
			<record xsi:type="q1:Folder" xmlns:q1="urn:filecabinet_2022_2.documents.webservices.netsuite.com">
			<q1:name>${name}</q1:name>
			${!parentId ? "" : `<q1:parent internalId="${parentId}"/>`}
			</record>
		</platformMsgs:add>`
	);
	const body = await response.text();
	return body.match(/internalId="(\d+)"/)?.[1] ?? false;
}

async function getFolderId(name, parentId) {
	const response = await sendRequest(
		"search",
		`<platformMsgs:search>
			<searchRecord xsi:type="q1:FolderSearch" xmlns:q1="urn:filecabinet_2022_2.documents.webservices.netsuite.com">
				<q1:basic>
					<name operator="is" xsi:type="platformCore:SearchStringField">
						<platformCore:searchValue>${name}</platformCore:searchValue>
					</name>
					${
						!parentId
							? ""
							: `<parent operator="anyOf" xsi:type="platformCore:SearchMultiSelectField">
									<platformCore:searchValue xsi:type="platformCore:RecordRef" internalId="${parentId}" />
								</parent>`
					}
				</q1:basic>
			</searchRecord>
		</platformMsgs:search>`
	);
	const body = await response.text();
	return body.match(/internalId="(\d+)"/)?.[1] ?? false;
}

async function uploadFile(fileName, fileContents, folderId) {
	return sendRequest(
		"upsert",
		`<platformMsgs:upsert>
			<record xsi:type="q1:File" xmlns:q1="urn:filecabinet_2022_2.documents.webservices.netsuite.com" externalId="${folderId}-${fileName}">
			<q1:name>${fileName}</q1:name>
			<q1:attachFrom>_computer</q1:attachFrom>
			<q1:content>${fileContents}</q1:content>
			<q1:folder internalId="${folderId}"/>
			</record>
		</platformMsgs:upsert>`
	);
}

function buildAuth() {
	const { account, consumerKey, consumerSecret, tokenId, tokenSecret } = config;
	const timestamp = Math.floor(new Date().getTime() / 1000);
	const nonce = crypto.randomBytes(16).toString("base64");
	const baseString = [account, consumerKey, tokenId, nonce, timestamp].join("&");
	const key = [consumerSecret, tokenSecret].join("&");
	const hmac = crypto.createHmac("sha256", key).update(baseString).digest("base64");

	return `
		<tokenPassport>
			<account>${account}</account>
			<consumerKey>${consumerKey}</consumerKey>
			<token>${tokenId}</token>
			<nonce>${nonce}</nonce>
			<timestamp>${timestamp}</timestamp>
			<signature algorithm="HMAC_SHA256">${hmac}</signature>
		</tokenPassport>
	`;
}

function buildRequestBody(action) {
	return `
		<soapenv:Envelope
			xmlns:xsd='http://www.w3.org/2001/XMLSchema'
			xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance'
			xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/'
			xmlns:platformCore='urn:core_2022_2.platform.webservices.netsuite.com'
			xmlns:platformMsgs='urn:messages_2022_2.platform.webservices.netsuite.com'>
		<soapenv:Header>
			${buildAuth()}
		</soapenv:Header>
			<soapenv:Body>
				${action}
			</soapenv:Body>
		</soapenv:Envelope>
	`;
}

function sendRequest(type, action) {
	const requestBody = buildRequestBody(action);
	const account = config.account.replace("_", "-").toLowerCase();
	return fetch(`https://${account}.suitetalk.api.netsuite.com/services/NetSuitePort_2022_2`, {
		method: "POST",
		body: requestBody,
		headers: {
			"Content-Type": "application/xml",
			SOAPAction: type,
		},
	});
}
