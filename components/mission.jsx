'use client'
import styled from 'styled-components';

const Styled = styled.section`
  .flex > * {
    flex-basis: 50%;}
  iframe.vimeo {
    background: black;}
    
  h1 {
    line-height: 1.7;
    max-width: 25ch;
    margin-block: -.4em;}
`

export default function Mission() {
  return (
    <Styled className='mt-8 mb-10' id='mission'>
      <h3 className='mb-10'>Notre mission</h3>
      <div className='grid lg:grid-cols-2 gap-10'>
        <iframe 
          src="https://player.vimeo.com/video/1102788773?h=86739cff75&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" 
          frameBorder="0" 
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media" 
          title=""
          className="vimeo w-full min-h-[40vh] lg:h-full lg:min-h-auto"
        ></iframe>
        <h1 className='text-4xl'>Cadavre exquis,<br/>«&nbsp;ouvroir de cinéma potentiel&nbsp;», est un laboratoire de valorisation patrimoniale et de création expérimentale dédié au cinéma scientifique et éducatif.</h1>
      </div>
    </Styled>
  );
}
