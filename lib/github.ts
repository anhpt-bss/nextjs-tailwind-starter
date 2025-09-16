import axios from 'axios'

const GITHUB_API = 'https://api.github.com'

export async function uploadFileToGithub({ owner, repo, path, token, fileContent, fileName }: any) {
  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`

  console.log(`[Uploading File] ${url}`)

  const res = await axios.put(
    url,
    {
      message: `Upload ${fileName}`,
      content: fileContent,
    },
    {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  )

  const { content, commit } = res.data

  return {
    sha: content.sha,
    download_url: content.download_url,
    preview_url: content.download_url,
    metadata: res.data,
  }
}

export async function deleteFileFromGithub({ owner, repo, path, token, sha, fileName }: any) {
  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`

  console.log(`[Deleting File] ${url}`)

  const res = await axios.delete(url, {
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
    data: {
      message: `Delete ${fileName}`,
      sha,
    },
  })

  return res.data
}

export async function checkFileExistsOnGithub({
  owner,
  repo,
  token,
  path,
}: {
  owner: string
  repo: string
  token: string
  path: string
}) {
  try {
    const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`

    console.log(`[Checking File Existence] ${url}`)

    const res = await fetch(url, {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    })

    if (res.status === 200) {
      const data = await res.json()
      return data
    }

    if (res.status === 404) {
      return false
    }

    throw new Error(`GitHub check failed with status ${res.status}`)
  } catch (err) {
    console.error('Error checking file existence on GitHub:', err)
    throw err
  }
}
