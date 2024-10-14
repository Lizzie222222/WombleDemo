import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { HiPlus, HiOutlineDocumentText, HiOutlineCog } from 'react-icons/hi';
import { Textarea } from "@/components/ui/textarea";

interface RagSection {
  id: string;
  title: string;
  qaPairs: { question: string; answer: string }[];
}

interface KnowledgeBase {
  id: string;
  name: string;
  contextLimit: number;
  maxRagResults: number;
  confidenceScore: number;
  ragSections: RagSection[];
}

interface Props {
  channelId: string;
}

function RagManager({ ragSections, updateRagSections }: { ragSections: RagSection[], updateRagSections: (sections: RagSection[]) => void }) {
  const [sections, setSections] = useState(ragSections);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [selectedQAPair, setSelectedQAPair] = useState<{ question: string; answer: string } | null>(null);
  const [editingQAPair, setEditingQAPair] = useState<{ question: string; answer: string } | null>(null);

  const addSection = () => {
    const newSection = { id: Date.now().toString(), title: 'New Section', qaPairs: [] };
    setSections([...sections, newSection]);
    setEditingSectionId(newSection.id);
  };

  const updateSection = (updatedSection: RagSection) => {
    const updatedSections = sections.map(section => 
      section.id === updatedSection.id ? updatedSection : section
    );
    setSections(updatedSections);
  };

  const removeSection = (sectionId: string) => {
    const updatedSections = sections.filter(section => section.id !== sectionId);
    setSections(updatedSections);
    setEditingSectionId(null);
    setSelectedQAPair(null);
  };

  const addQAPair = (sectionId: string) => {
    const updatedSections = sections.map(section => {
      if (section.id === sectionId) {
        const newQAPair = { question: 'New Question', answer: '' };
        return { ...section, qaPairs: [...section.qaPairs, newQAPair] };
      }
      return section;
    });
    setSections(updatedSections);
    setSelectedQAPair(updatedSections.find(s => s.id === sectionId)?.qaPairs.slice(-1)[0] || null);
  };

  const startEditingQAPair = (qaPair: { question: string; answer: string }) => {
    setSelectedQAPair(qaPair);
    setEditingQAPair({ question: '', answer: '' });
  };

  const updateQAPair = (sectionId: string, index: number, updatedQAPair: { question: string; answer: string }) => {
    const updatedSections = sections.map(section => {
      if (section.id === sectionId) {
        const updatedQAPairs = [...section.qaPairs];
        updatedQAPairs[index] = {
          question: updatedQAPair.question || updatedQAPairs[index].question,
          answer: updatedQAPair.answer || updatedQAPairs[index].answer
        };
        return { ...section, qaPairs: updatedQAPairs };
      }
      return section;
    });
    setSections(updatedSections);
    setSelectedQAPair(updatedQAPair);
    setEditingQAPair(null);
  };

  const removeQAPair = (sectionId: string, index: number) => {
    const updatedSections = sections.map(section => {
      if (section.id === sectionId) {
        const updatedQAPairs = section.qaPairs.filter((_, i) => i !== index);
        return { ...section, qaPairs: updatedQAPairs };
      }
      return section;
    });
    setSections(updatedSections);
    setSelectedQAPair(null);
  };

  return (
    <Card className="p-4">
      <h3 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-zinc-100">RAG Sections</h3>
      <div className="flex space-x-4">
        <div className="w-1/2 pr-2 border-r border-zinc-200 dark:border-zinc-700">
          {sections.map((section) => (
            <Card key={section.id} className="p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                {editingSectionId === section.id ? (
                  <Input
                    value={section.title}
                    onChange={(e) => updateSection({ ...section, title: e.target.value })}
                    onBlur={() => setEditingSectionId(null)}
                    className="text-lg font-semibold text-zinc-900 dark:text-zinc-100"
                    autoFocus
                  />
                ) : (
                  <h4 
                    className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 cursor-pointer" 
                    onClick={() => setEditingSectionId(section.id)}
                  >
                    {section.title}
                  </h4>
                )}
                <Button variant="outline" size="sm" onClick={() => removeSection(section.id)}>
                  Remove
                </Button>
              </div>
              <ul>
                {section.qaPairs.map((qaPair, index) => (
                  <li key={index} className="mb-2">
                    <p className="text-zinc-700 dark:text-zinc-300 cursor-pointer" onClick={() => setSelectedQAPair(qaPair)}>
                      Q: {qaPair.question}
                    </p>
                  </li>
                ))}
              </ul>
              <Button variant="outline" size="sm" onClick={() => addQAPair(section.id)} className="mt-2">
                Add Q&A Pair
              </Button>
            </Card>
          ))}
          <Button onClick={addSection} className="w-full">Add New Section</Button>
        </div>
        <div className="w-1/2 pl-2">
          {selectedQAPair && (
            <div>
              <h4 className="text-lg font-semibold mb-2 text-zinc-900 dark:text-zinc-100">Edit Q&A Pair</h4>
              <Input
                value={editingQAPair?.question ?? selectedQAPair.question}
                onChange={(e) => setEditingQAPair({ ...editingQAPair!, question: e.target.value })}
                onFocus={() => !editingQAPair && startEditingQAPair(selectedQAPair)}
                onBlur={() => {
                  if (editingQAPair) {
                    updateQAPair(
                      sections.find(s => s.qaPairs.includes(selectedQAPair))!.id,
                      sections.find(s => s.qaPairs.includes(selectedQAPair))!.qaPairs.indexOf(selectedQAPair),
                      { ...selectedQAPair, ...editingQAPair }
                    );
                  }
                }}
                className="mb-2 text-zinc-900 dark:text-zinc-100"
                placeholder="Question"
              />
              <Textarea
                value={editingQAPair?.answer ?? selectedQAPair.answer}
                onChange={(e) => setEditingQAPair({ ...editingQAPair!, answer: e.target.value })}
                onFocus={() => !editingQAPair && startEditingQAPair(selectedQAPair)}
                onBlur={() => {
                  if (editingQAPair) {
                    updateQAPair(
                      sections.find(s => s.qaPairs.includes(selectedQAPair))!.id,
                      sections.find(s => s.qaPairs.includes(selectedQAPair))!.qaPairs.indexOf(selectedQAPair),
                      { ...selectedQAPair, ...editingQAPair }
                    );
                  }
                }}
                className="mb-2 text-zinc-900 dark:text-zinc-100"
                placeholder="Answer"
              />
            </div>
          )}
        </div>
      </div>
      <Button onClick={() => updateRagSections(sections)} className="mt-4">Save Changes</Button>
    </Card>
  );
}

export default function KnowledgeBaseManager({ channelId }: Props) {
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBase | null>(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [newKnowledgeBase, setNewKnowledgeBase] = useState<KnowledgeBase>({
    id: '',
    name: '',
    contextLimit: 1000,
    maxRagResults: 3,
    confidenceScore: 0.7,
    ragSections: [],
  });
  const [isRagManagerOpen, setIsRagManagerOpen] = useState(false);

  useEffect(() => {
    // Fetch knowledge base data for the channel
    // This is a placeholder, replace with actual data fetching logic
    // setKnowledgeBase(fetchedKnowledgeBase);
  }, [channelId]);

  const openWizard = () => {
    setIsWizardOpen(true);
    setWizardStep(1);
  };

  const closeWizard = () => {
    setIsWizardOpen(false);
    setNewKnowledgeBase({
      id: '',
      name: '',
      contextLimit: 1000,
      maxRagResults: 3,
      confidenceScore: 0.7,
      ragSections: [],
    });
  };

  const handleNextStep = () => {
    setWizardStep(wizardStep + 1);
  };

  const handlePreviousStep = () => {
    setWizardStep(wizardStep - 1);
  };

  const handleCreateKnowledgeBase = () => {
    // Add logic to create the knowledge base
    setKnowledgeBase(newKnowledgeBase);
    closeWizard();
  };

  const updateRagSections = (sections: RagSection[]) => {
    setKnowledgeBase({ ...knowledgeBase!, ragSections: sections });
    setIsRagManagerOpen(false);
  };

  return (
    <div className="space-y-4">
      {knowledgeBase ? (
        <>
          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <HiOutlineDocumentText className="mr-2 h-5 w-5 text-zinc-500" />
                <h4 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{knowledgeBase.name}</h4>
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsWizardOpen(true)}>
                <HiOutlineCog className="mr-2 h-4 w-4" />
                Configure
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm text-zinc-600 dark:text-zinc-400">
              <div>
                <p>Context Limit</p>
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">{knowledgeBase.contextLimit} tokens</p>
              </div>
              <div>
                <p>Max RAG Results</p>
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">{knowledgeBase.maxRagResults}</p>
              </div>
              <div>
                <p>Confidence Score</p>
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">{knowledgeBase.confidenceScore}</p>
              </div>
            </div>
          </Card>
          <RagManager ragSections={knowledgeBase.ragSections} updateRagSections={updateRagSections} />
        </>
      ) : (
        <div className="text-center py-8">
          <HiOutlineDocumentText className="mx-auto h-12 w-12 text-zinc-400" />
          <h4 className="mt-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">No Knowledge Base</h4>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Add a knowledge base to enhance your AI's responses</p>
          <Button className="mt-4" onClick={openWizard}>
            <HiPlus className="mr-2 h-4 w-4" />
            Add Knowledge Base
          </Button>
        </div>
      )}
      {/* Wizard Dialog */}
      <Dialog open={isWizardOpen} onOpenChange={setIsWizardOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-zinc-900 dark:text-zinc-100">{knowledgeBase ? 'Configure Knowledge Base' : 'Add Knowledge Base'}</DialogTitle>
          </DialogHeader>
          {wizardStep === 1 && (
            <div>
              <label htmlFor="kbName" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Knowledge Base Name</label>
              <Input
                id="kbName"
                value={newKnowledgeBase.name}
                onChange={(e) => setNewKnowledgeBase({...newKnowledgeBase, name: e.target.value})}
                className="mt-1 text-zinc-900 dark:text-zinc-100"
              />
            </div>
          )}
          {wizardStep === 2 && (
            <div className="space-y-4">
              <div>
                <label htmlFor="contextLimit" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Context Limit (tokens)</label>
                <Input
                  id="contextLimit"
                  type="number"
                  value={newKnowledgeBase.contextLimit}
                  onChange={(e) => setNewKnowledgeBase({...newKnowledgeBase, contextLimit: parseInt(e.target.value)})}
                  className="mt-1 text-zinc-900 dark:text-zinc-100"
                />
              </div>
              <div>
                <label htmlFor="maxRagResults" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Max RAG Results</label>
                <Input
                  id="maxRagResults"
                  type="number"
                  value={newKnowledgeBase.maxRagResults}
                  onChange={(e) => setNewKnowledgeBase({...newKnowledgeBase, maxRagResults: parseInt(e.target.value)})}
                  className="mt-1 text-zinc-900 dark:text-zinc-100"
                />
              </div>
              <div>
                <label htmlFor="confidenceScore" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Confidence Score</label>
                <Slider
                  id="confidenceScore"
                  min={0}
                  max={1}
                  step={0.01}
                  value={[newKnowledgeBase.confidenceScore]}
                  onValueChange={(value) => setNewKnowledgeBase({...newKnowledgeBase, confidenceScore: value[0]})}
                  className="mt-1"
                />
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{newKnowledgeBase.confidenceScore.toFixed(2)}</p>
              </div>
            </div>
          )}
          {wizardStep === 3 && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">RAG Sections</h4>
              {newKnowledgeBase.ragSections.map((section, sectionIndex) => (
                <Card key={section.id} className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <Input
                      value={section.title}
                      onChange={(e) => {
                        const updatedSections = [...newKnowledgeBase.ragSections];
                        updatedSections[sectionIndex].title = e.target.value;
                        setNewKnowledgeBase({...newKnowledgeBase, ragSections: updatedSections});
                      }}
                      placeholder="Section Title"
                      className="text-zinc-900 dark:text-zinc-100"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const updatedSections = newKnowledgeBase.ragSections.filter((_, index) => index !== sectionIndex);
                        setNewKnowledgeBase({...newKnowledgeBase, ragSections: updatedSections});
                      }}
                    >
                      Remove Section
                    </Button>
                  </div>
                  {section.qaPairs.map((qaPair, qaPairIndex) => (
                    <div key={qaPairIndex} className="mt-2 space-y-2">
                      <Input
                        value={qaPair.question}
                        onChange={(e) => {
                          const updatedSections = [...newKnowledgeBase.ragSections];
                          updatedSections[sectionIndex].qaPairs[qaPairIndex].question = e.target.value;
                          setNewKnowledgeBase({...newKnowledgeBase, ragSections: updatedSections});
                        }}
                        placeholder="Question"
                        className="text-zinc-900 dark:text-zinc-100"
                      />
                      <Textarea
                        value={qaPair.answer}
                        onChange={(e) => {
                          const updatedSections = [...newKnowledgeBase.ragSections];
                          updatedSections[sectionIndex].qaPairs[qaPairIndex].answer = e.target.value;
                          setNewKnowledgeBase({...newKnowledgeBase, ragSections: updatedSections});
                        }}
                        placeholder="Answer"
                        className="text-zinc-900 dark:text-zinc-100"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const updatedSections = [...newKnowledgeBase.ragSections];
                          updatedSections[sectionIndex].qaPairs = updatedSections[sectionIndex].qaPairs.filter((_, index) => index !== qaPairIndex);
                          setNewKnowledgeBase({...newKnowledgeBase, ragSections: updatedSections});
                        }}
                      >
                        Remove Q&A Pair
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const updatedSections = [...newKnowledgeBase.ragSections];
                      updatedSections[sectionIndex].qaPairs.push({ question: '', answer: '' });
                      setNewKnowledgeBase({...newKnowledgeBase, ragSections: updatedSections});
                    }}
                    className="mt-2"
                  >
                    Add Q&A Pair
                  </Button>
                </Card>
              ))}
              <Button
                onClick={() => {
                  const newSection: RagSection = {
                    id: Date.now().toString(),
                    title: '',
                    qaPairs: [{ question: '', answer: '' }],
                  };
                  setNewKnowledgeBase({
                    ...newKnowledgeBase,
                    ragSections: [...newKnowledgeBase.ragSections, newSection],
                  });
                }}
              >
                Add New Section
              </Button>
            </div>
          )}
          <DialogFooter>
            {wizardStep > 1 && (
              <Button variant="outline" onClick={handlePreviousStep}>Back</Button>
            )}
            {wizardStep < 3 ? (
              <Button onClick={handleNextStep}>Next</Button>
            ) : (
              <Button onClick={handleCreateKnowledgeBase}>{knowledgeBase ? 'Update' : 'Create'}</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}