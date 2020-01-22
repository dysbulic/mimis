import React, { useState, useEffect } from 'react'
import './index.scss'
import { useDB } from 'react-pouchdb'
import File from '../File'

export default (props) => {
  const { path, hash } = props
  const db = useDB()
  const [docs, setDocs] = useState(null)
  const [cover, setCover] = useState(null)

  useEffect(
    () => {
      db.allDocs({
        startkey: hash, endkey: `${hash}\uFFF0`,
        limit: 500, include_docs: true,
      })
      .then((res) => {
        const files = res.rows.map((r) => ({
          path: r.id,
          name: r.doc.path.slice(-1)[0],
        }))
        let img
        if(img = files.find((f) => /^cover/.test(f.name))) {
          setCover(img)
          setDocs(null)
        } else if(files.length === 1) {
          //setFrame(files[0])
        } else {
          setDocs(files)
          setCover(null)
        }
      })
    },
    [hash]
  )

  return <div className='mimis-fileentry'>
    <h3>{path}</h3>

    {cover && <img src={`//ipfs.io/ipfs/${cover.path}`} />}

    {docs &&
      <ul className='mimis-filelist'>
        {docs.map((d, i) => <li key={i}><File {...d} /></li>)}
      </ul>
    }
  </div>
}