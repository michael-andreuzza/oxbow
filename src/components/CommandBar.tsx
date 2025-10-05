
import React, { useState, useRef, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import {
  pageSections,
  pageExamples,
  elements,
  navigation,
  overlay,
  forms,
  storeSections,
} from "../data/entries.json";

// Helper to flatten and search nested commands
function flattenCommands(commands, parentTitles = []) {
  let flat = [];
  for (const cmd of commands) {
    if (cmd.children) {
      flat = flat.concat(flattenCommands(cmd.children, [...parentTitles, cmd.title]));
    } else {
      flat.push({ ...cmd, parentTitles });
    }
  }
  return flat;
}

// Build the Ninja-style command tree
const buildCommands = () => {
  const sumCounts = (items: { count?: number }[]) =>
    items.reduce((acc, item) => acc + (item.count ?? 0), 0);

  const marketingEntries = [...pageSections, ...pageExamples];
  const marketingChildren = marketingEntries.map(section => ({
    id: section.name,
    title: section.name,
    keywords: section.tags.join(", "),
    count: section.count ?? 0,
    action: () => window.open(section.link, "_self"),
  }));
  const marketingTotal = sumCounts(marketingChildren);

  const applicationEntries = [...elements, ...navigation, ...overlay, ...forms];
  const applicationChildren = applicationEntries.map(entry => ({
    id: entry.name,
    title: entry.name,
    keywords: entry.tags.join(", "),
    count: entry.count ?? 0,
    action: () => window.open(entry.link, "_self"),
  }));
  const applicationTotal = sumCounts(applicationChildren);

  const ecommerceChildren = storeSections.map(section => ({
    id: section.name,
    title: section.name,
    keywords: section.tags.join(", "),
    count: section.count ?? 0,
    action: () => window.open(section.link, "_self"),
  }));
  const ecommerceTotal = sumCounts(ecommerceChildren);

  const totalComponents = marketingTotal + applicationTotal + ecommerceTotal;

  return [
    {
      id: "home",
      title: "Home",
      keywords: "home, index, root",
      action: () => window.open("/", "_self"),
    },
    {
      id: "website-templates",
      title: "Astro & Tailwind CSS Templates",
      keywords: "templates, website templates, Astro templates, Tailwind CSS templates, web design, theme, site templates, UI kits, front-end templates, responsive design, web development",
      action: () => window.open("https://lexingtonthemes.com/", "_self"),
    },
    {
      id: "docs",
      title: "Documentation",
      keywords: "docs, documentation, guides, tutorials, how-to ",
      action: () => window.open("/documentation/getting-started", "_self"),
    },
    {
      id: "changelog",
      title: "Changelog",
      keywords: "changelog, updates, new features, version history",
      action: () => window.open("/changelog", "_self"),
    },
    {
      id: "components",
      title: "Components",
      count: totalComponents,
      children: [
        {
          id: "marketing-components",
          title: "Marketing Components",
          count: marketingTotal,
          children: marketingChildren,
        },
        {
          id: "application-components",
          title: "Application Components",
          count: applicationTotal,
          children: applicationChildren,
        },
        {
          id: "ecommerce-components",
          title: "Ecommerce Components",
          count: ecommerceTotal,
          children: ecommerceChildren,
        },
      ],
    },
  ];
};


export default function CommandBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const [stack, setStack] = useState([]); // for nested navigation
  const inputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  const commands = buildCommands();
  // Get current menu (root or children)
  const currentMenu = stack.length === 0 ? commands : (Array.isArray(stack[stack.length - 1].children) ? stack[stack.length - 1].children : []);
  // Flatten for search
  const flat = flattenCommands(commands);
  const filtered = query
    ? flat.filter(cmd =>
        (cmd.title + " " + (cmd.keywords || "") + " " + (cmd.parentTitles || []).join(" ")).toLowerCase().includes(query.toLowerCase())
      )
    : (Array.isArray(currentMenu) ? currentMenu : []);

  // Open with Cmd+K
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (open) {
        if (e.key === "Escape") {
          if (query) setQuery("");
          else if (stack.length > 0) setStack(s => s.slice(0, -1));
          else setOpen(false);
        }
        if (e.key === "ArrowDown") setSelected(s => Math.min(s + 1, filtered.length - 1));
        if (e.key === "ArrowUp") setSelected(s => Math.max(s - 1, 0));
        if (e.key === "Enter" && filtered[selected]) {
          const cmd = filtered[selected];
          if (cmd.children) {
            setStack(s => [...s, cmd]);
            setQuery("");
            setSelected(0);
          } else if (cmd.action) {
            cmd.action();
            setOpen(false);
          }
        }
        if (e.key === "Backspace" && !query && stack.length > 0) {
          setStack(s => s.slice(0, -1));
          setSelected(0);
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, filtered, selected, query, stack]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open, stack]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center select-none bg-black/40 backdrop-blur-[2px]"
      onClick={() => setOpen(false)}
    >
      <div
        className="relative w-full max-w-xl transition-colors shadow-xl bg-beige divide-y divide-base-200 dark:bg-base-950 dark:divide-base-800 outline outline-base-300 dark:outline-base-700 "
        role="dialog"
        aria-modal="true"
        aria-label="Command Bar"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative divide-y divide-base-200 dark:divide-base-800 p-4">
          {stack.length > 0 && !query && (
            <div className="px-4 py-2">
              <button className="mb-2 text-xs text-base-400 hover:text-base-700 dark:hover:text-base-200" onClick={() => setStack(s => s.slice(0, -1))}>Back</button>
            </div>
          )}
          <input
            ref={inputRef}
            className="w-full px-3 py-2 bg-beige dark:bg-base-900 text-base-900 dark:text-base-100 outline-none  border border-none dark:border-none focus:ring-2 focus:ring-secondary-400 placeholder:text-base-400 dark:placeholder:text-base-500"
            placeholder={stack.length > 0 ? `Search ${stack[stack.length-1].title}...` : "Type a command..."}
            value={query}
            onChange={e => { setQuery(e.target.value); setSelected(0); }}
            onKeyDown={e => {
              e.stopPropagation();
              if (e.key === "Escape") {
                if (query) setQuery("");
                else if (stack.length > 0) setStack(s => s.slice(0, -1));
                else setOpen(false);
              } else if (e.key === "ArrowDown" && filtered.length > 0) {
                // Always move from input to first item
                setSelected(0);
                setTimeout(() => itemRefs.current[0]?.focus(), 0);
              }
            }}
            autoFocus
          />
          <ul className="divide-y divide-base-200 mt-2 dark:divide-base-800 max-h-80 overflow-y-auto  scrollbar-hide border-t border-x border-base-200 dark:border-base-800  ">
            {filtered.length === 0 && (
              <li className="p-3 text-base-400">No commands found</li>
            )}
            {filtered.map((cmd, i) => (
              <li
                key={cmd.id || cmd.title}
                ref={el => itemRefs.current[i] = el}
                tabIndex={0}
                className={`p-3 cursor-pointer text-sm font-medium  flex items-center justify-between outline-none transition-colors ${i === selected ? "bg-secondary-500/10 dark:bg-secondary-500/20 text-base-900 dark:text-base-50" : "text-base-500 dark:text-base-400"}`}
                onMouseEnter={() => setSelected(i)}
                onClick={() => {
                  if (cmd.children) {
                    setStack(s => [...s, cmd]);
                    setQuery("");
                    setTimeout(() => {
                      setSelected(0);
                      itemRefs.current[0]?.focus();
                    }, 0);
                  } else if (cmd.action) {
                    cmd.action();
                    setOpen(false);
                  }
                }}
                onKeyDown={e => {
                  if (e.key === "Escape") {
                    if (query) setQuery("");
                    else if (stack.length > 0) setStack(s => s.slice(0, -1));
                    else setOpen(false);
                  } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                    e.stopPropagation();
                    e.preventDefault();
                    if (e.key === "ArrowUp") {
                      if (i === 0) {
                        inputRef.current?.focus();
                        setSelected(-1);
                      } else {
                        setSelected(i - 1);
                        setTimeout(() => itemRefs.current[i - 1]?.focus(), 0);
                      }
                    } else if (e.key === "ArrowDown") {
                      if (i < filtered.length - 1) {
                        setSelected(i + 1);
                        setTimeout(() => itemRefs.current[i + 1]?.focus(), 0);
                      }
                    }
                  } else if (e.key === "Enter" && i === selected) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (cmd.children) {
                      setStack(s => [...s, cmd]);
                      setQuery("");
                      setTimeout(() => {
                        setSelected(0);
                        itemRefs.current[0]?.focus();
                      }, 0);
                      return; // Do not trigger any action
                    } else if (cmd.action) {
                      cmd.action();
                      setOpen(false);
                    }
                  }
                }}
              >
                <span>{cmd.title}</span>
                <span className="flex items-center gap-2">
                  {typeof cmd.count === "number" && (
                    <span className=" text-xs font-mono text-base-600  dark:text-base-200">
                      {cmd.count}
                    </span>
                  )}
                  {cmd.children && <ChevronRight className="w-4 h-4 text-base-400" aria-label="submenu" />}
                </span>
              </li>
            ))}
          </ul>
          <div className="p-4 pb-2 text-xs text-base-500 dark:text-base-400 flex flex-col items-center gap-1 select-none">
            <div className="flex gap-2 items-center flex-wrap justify-center">
              <kbd className="flex items-center justify-center px-1 text-[0.65rem] font-mono font-medium uppercase text-base-700 dark:text-base-100">↑↓</kbd>
              Move
              <kbd className="flex items-center justify-center px-1 text-[0.65rem] font-mono font-medium uppercase text-base-700 dark:text-base-100">Enter</kbd>
              Select
              <kbd className="flex items-center justify-center px-1 text-[0.65rem] font-mono font-medium uppercase text-base-700 dark:text-base-100">Esc</kbd>
              Close
              <kbd className="flex items-center justify-center px-1 text-[0.65rem] font-mono font-medium uppercase text-base-700 dark:text-base-100">Backspace</kbd>
              Go Back
              <kbd className="flex items-center justify-center px-1 text-[0.65rem] font-mono font-medium uppercase text-base-700 dark:text-base-100">Cmd</kbd>
              <kbd className="flex items-center justify-center px-1 text-[0.65rem] font-mono font-medium uppercase text-base-700 dark:text-base-100">K</kbd>
              Open
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
