import { useEffect, useState } from 'react';
import supabase from './supabase';
import './style.css';


const CATEGORIES = [
  { name: "technology", color: "#228b75" },
  { name: "science", color: "#00531f" },
  { name: "finance", color: "#ff6a56" },
  { name: "society", color: "#dd8706" },
  { name: "entertainment", color: "#f13d55" },
  { name: "health", color: "#13e1fc" },
  { name: "history", color: "#f94b16" },
  { name: "news", color: "#4c00c5" },
];

const initialFacts = [
  {
    id: 1,
    text: "React is being developed by Meta (formerly facebook)",
    source: "https://opensource.fb.com/",
    category: "technology",
    votesInteresting: 24,
    votesMindblowing: 9,
    votesFalse: 4,
    createdIn: 2021,
  },
  {
    id: 2,
    text: "Millennial dads spend 3 times as much time with their kids than their fathers spent with them. In 1982, 43% of fathers had never changed a diaper. Today, that number is down to 3%",
    source:
      "https://www.mother.ly/parenting/millennial-dads-spend-more-time-with-their-kids",
    category: "society",
    votesInteresting: 11,
    votesMindblowing: 2,
    votesFalse: 0,
    createdIn: 2019,
  },
  {
    id: 3,
    text: "Lisbon is the capital of Portugal",
    source: "https://en.wikipedia.org/wiki/Lisbon",
    category: "society",
    votesInteresting: 8,
    votesMindblowing: 3,
    votesFalse: 1,
    createdIn: 2015,
  },
];

function App(){
  // 1.Define state variable
  const [showForm, setShowForm] = useState(false);
  const [facts, setFacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("all");

  useEffect(function(){

    async function getFacts(){
      setIsLoading(true);

      let query = supabase.from('facts').select('*');
      if(currentCategory !== 'all'){
        query = query.eq('category', currentCategory);
      }
      const { data: facts, error } = await query
      .order('text', {ascending : true})
      .limit(100);
      
      if(!error){
        setFacts(facts);
        setIsLoading(false);
      }
      else{
        alert('There was a problem getting data.')
      }
    }
    getFacts();
    

  }, [currentCategory]);

  return(
    <>
      <Header showForm={showForm} setShowForm={setShowForm} />

      {/* 2. Use state variable */}
      {showForm && <NewFactForm setFacts={setFacts} setShowForm={setShowForm} />}

      <main className='main'>
        
        <CategoryFilter setCurrentCategory={setCurrentCategory} />
        {isLoading ? <Loader /> : <FactList facts={facts} setFacts={setFacts} /> }
      </main>

    </>
  );
};

function Loader(){
  return(
    <p className='message'>
      Loading...
    </p>
  )
}

function Header({showForm, setShowForm}){
  const title = "Today I Learned";
  return (
    <header className="header">
          <div className="logo">
              <img src="logo.png" alt="Logo" />
              <h1>{title}</h1>
          </div>
          {/* 3.Update state variable */}
          <button className="btn btn-large btn-open" onClick={() => setShowForm((show) => !show )}>{showForm ? 'Close' : 'Share a fact'} </button>
      </header>
  )
};

// Check if a url is a string
function isValidHttpUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

function NewFactForm({setFacts,setShowForm}){""
  const [text, setText] = useState("");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const textLength = text.length;

  async function handleSubmit(e){
    // 1. Prevent browser reload
    e.preventDefault();

    // 2. Check if data is valid. If so, create a new fact.
    if(text && isValidHttpUrl(source) && category && text.length <= 200){
      // -----------------
       // 3. Create a new fact object
      // const newFact = {
      //   id: Math.round(Math.random() * 100000000) ,
      //   text,
      //   source,
      //   category,
      //   votesInteresting:0,
      //   votesMindblowing:0,
      //   votesFalse:0,
      //   createdIn: new Date().getFullYear()
      // }

      // ------------------
      // 3. Upload fact to Supabase and receive the new fact object
      setIsUploading(true);
      const {data:newFact, error} = await supabase.from("facts").insert([{text, source, category}]).select();
      setIsUploading(false);

       // 4. Add the new fact to the UI: Add the fact to state
       if(!error) setFacts((facts) => [newFact[0], ...facts]);

      // 5. Restart input fields
      setText('');
      setSource('');
      setCategory('');

      // 6. Close the form
      setShowForm(false);
    } 
  }

  return(
    <form className='fact-form' onSubmit={handleSubmit}>
      <input type="text" placeholder="Share a fact with world..." value={text} onChange={(e) => setText(e.target.value)} disabled={isUploading} />
      <span>{200 - text.length}</span>
      <input type="text" placeholder="Trustworthy source..." value={source} onChange={(e) => setSource(e.target.value)} disabled={isUploading} />
      <select value={category} onChange={(e) => setCategory(e.target.value)} disabled={isUploading}>
          <option>Choose Category</option>
          {CATEGORIES.map((cat) => <option key={cat.name} value={cat.name}>{cat.name.toUpperCase()}</option>)}
      </select>
      <button className="btn btn-large" disabled={isUploading}>Post</button>
    </form>
  );
};

function CategoryFilter({setCurrentCategory}){
  return(
    <aside>
      <ul>
        <li className="category">
          <button className="btn btn-all-categories" onClick={() => {
            setCurrentCategory("all");
          }}>
            All
          </button>
        </li> 
        {CATEGORIES.map((cat) => {
          return (
          <li key={cat.name} className="category">
            <button className="btn btn-category" style={{backgroundColor: cat.color}} onClick={() => 
            setCurrentCategory(cat.name) }>
              {cat.name}
            </button>
          </li> 
          )
        })}
      </ul>
    </aside>
  );
};



function FactList({facts, setFacts}){
  // const [facts,setFacts] = useState(initialFacts);
  // const facts = initialFacts;

  if(facts.length === 0){
    return(
      <p className='message'>No Facts for this category yet. Create the first one!</p>
    )
  }

  return(
    <section>
      <ul className="facts-list">{
        facts.map((fact) => {
          return (
            <Fact key={fact.id}  factObj={fact} setFatcs={setFacts} />
          )
        })
      }</ul>
      <p>There are {facts.length} facts in the database.</p>
    </section>
  );
}

function Fact(props){
  const {factObj,setFacts} = props;
  const [isUpdating, setIsUpdating] = useState(false);
  const isDisputed = factObj.votesInteresting + factObj.votesMindblowing < factObj.votesFalse;

  async function handleVote(columnName){
    setIsUpdating(true);
    const {data:updatedFact,error} = await 
    supabase
    .from('facts')
    .update({[columnName]: factObj[columnName] + 1})
    .eq("id", factObj.id)
    .select();
    setIsUpdating(false);

    if(!error) {
      setFacts((facts) => facts.map((f) => (f.id === factObj.id ? updatedFact[0] : f)))
    }
  }
  
  return (
    <li className="fact">
        <p>
          {isDisputed ? <span className='disputed'>[⛔️DISPUTED]</span> : null}
          {factObj.text} 
            <a className="source" href={factObj.source} target="_blank">(Source)</a>
        </p>
        <span className="tag" style={{backgroundColor : CATEGORIES.find((cat) =>cat.name === factObj.category).color}}>{factObj.category}</span>
        <div className="vote-buttons">
            <button onClick={() => handleVote("votesInteresting")} disabled={isUpdating}>👍 <strong>{factObj.votesInteresting}</strong></button>
            <button onClick={() => handleVote("votesMindblowing")}>🤯 <strong>{factObj.votesMindblowing}</strong></button>
            <button onClick={() => handleVote("votesFalse")}>⛔️ <strong>{factObj.votesFalse}</strong></button>
        </div>
    </li>
  )
}

export default App;