import type { Agent } from '../lib/types';

const initials = (name: string) => name.split(' ').map((w) => w[0]).join('');

// Shows the adviser's headshot, or their initials until a photo is added.
export function AgentAvatar({ agent, className = 'agent__mono', alt = true }: { agent: Agent; className?: string; alt?: boolean }) {
  if (agent.photo) {
    return (
      <div className={`${className} has-photo`}>
        <img src={agent.photo} alt={alt ? agent.name : ''} loading="lazy" />
      </div>
    );
  }
  return <div className={className} aria-hidden>{initials(agent.name)}</div>;
}
