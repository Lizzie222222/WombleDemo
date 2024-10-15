import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { HiPlus, HiOutlineDocumentText, HiOutlineCog, HiTrash } from 'react-icons/hi';
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import Confetti from 'react-confetti';

interface Variant {
  id: string;
  typeId: string;
  value: string;
  answer: string;
  active?: boolean; // Optional active property
}

interface QAPair {
  question: string;
  answer: string;
  variants: Variant[];
}

interface RagSection {
  id: string;
  title: string;
  qaPairs: QAPair[];
}

interface KnowledgeBase {
  id: string;
  name: string;
  contextLimit: number;
  maxRagResults: number;
  confidenceScore: number;
  variantTypes: {
    id: string;
    name: string;
    options: string[];
  }[];
  // Remove the ragSections property
}

interface Props {
  channelId: string;
}

interface RagManagerProps {
  knowledgeBase: KnowledgeBase;
  updateKnowledgeBase: React.Dispatch<React.SetStateAction<KnowledgeBase>>;
}

function RagManager({ knowledgeBase, updateKnowledgeBase }: RagManagerProps) {
  // If you still need to manage sections, you could use local state:
  const [sections, setSections] = useState<RagSection[]>([]);

  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [selectedQAPair, setSelectedQAPair] = useState<QAPair | null>(null);
  const [editingQAPair, setEditingQAPair] = useState<QAPair | null>(null);

  const handleSelectQAPair = (qaPair: QAPair) => {
    setSelectedQAPair(qaPair);
    setEditingQAPair(null);
  };

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
    const newQAPair: QAPair = { question: 'New Question', answer: '', variants: [] };
    const updatedSections = sections.map(section => {
      if (section.id === sectionId) {
        return { ...section, qaPairs: [...section.qaPairs, newQAPair] };
      }
      return section;
    });
    setSections(updatedSections);
    setSelectedQAPair(newQAPair);
    setEditingQAPair(newQAPair);
  };

  const startEditingQAPair = (qaPair: QAPair) => {
    setSelectedQAPair(qaPair);
    setEditingQAPair({ ...qaPair });
  };

  const updateQAPair = (sectionId: string, index: number, updatedQAPair: QAPair) => {
    const updatedSections = sections.map(section => {
      if (section.id === sectionId) {
        const updatedQAPairs = [...section.qaPairs];
        updatedQAPairs[index] = updatedQAPair;
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

  const deleteQAPair = () => {
    if (!selectedQAPair) return;

    const sectionId = sections.find(s => s.qaPairs.includes(selectedQAPair))!.id;
    const updatedSections = sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          qaPairs: section.qaPairs.filter(qa => qa !== selectedQAPair)
        };
      }
      return section;
    });

    setSections(updatedSections);
    setSelectedQAPair(null);
    setEditingQAPair(null);
  };

  const addVariant = () => {
    if (!selectedQAPair) return;
    const newVariant: Variant = {
      id: Date.now().toString(),
      typeId: '',
      value: '',
      answer: ''
    };
    const updatedQAPair = {
      ...selectedQAPair,
      variants: [...selectedQAPair.variants, newVariant]
    };
    updateQAPair(
      sections.find(s => s.qaPairs.includes(selectedQAPair))!.id,
      sections.find(s => s.qaPairs.includes(selectedQAPair))!.qaPairs.indexOf(selectedQAPair),
      updatedQAPair
    );
  };

  const updateVariant = (variantId: string, updates: Partial<Variant>) => {
    if (!selectedQAPair) return;
    const updatedVariants = selectedQAPair.variants.map(v =>
      v.id === variantId ? { ...v, ...updates } : v
    );
    const updatedQAPair = { ...selectedQAPair, variants: updatedVariants };
    updateQAPair(
      sections.find(s => s.qaPairs.includes(selectedQAPair))!.id,
      sections.find(s => s.qaPairs.includes(selectedQAPair))!.qaPairs.indexOf(selectedQAPair),
      updatedQAPair
    );
  };

  const removeVariant = (variantId: string) => {
    if (!selectedQAPair) return;
    const updatedVariants = selectedQAPair.variants.filter(v => v.id !== variantId);
    const updatedQAPair = { ...selectedQAPair, variants: updatedVariants };
    updateQAPair(
      sections.find(s => s.qaPairs.includes(selectedQAPair))!.id,
      sections.find(s => s.qaPairs.includes(selectedQAPair))!.qaPairs.indexOf(selectedQAPair),
      updatedQAPair
    );
  };

  const toggleVariantActive = (variantId: string) => {
    if (!selectedQAPair) return;
    const updatedVariants = selectedQAPair.variants.map(v =>
      v.id === variantId ? { ...v, active: !v.active } : v
    );
    const updatedQAPair = { ...selectedQAPair, variants: updatedVariants };
    updateQAPair(
      sections.find(s => s.qaPairs.includes(selectedQAPair))!.id,
      sections.find(s => s.qaPairs.includes(selectedQAPair))!.qaPairs.indexOf(selectedQAPair),
      updatedQAPair
    );
  };

  // Update sections
  const updateSections = (newSections: RagSection[]) => {
    setSections(newSections);
    // If you need to update the knowledgeBase with this information,
    // you could do so here, or in a useEffect hook
  };

  return (
    <Card className="p-4">
      <h3 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-zinc-100">RAG Management</h3>
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
                  <li 
                    key={index} 
                    className={`mb-2 p-2 rounded cursor-pointer transition-colors ${
                      selectedQAPair === qaPair 
                        ? 'bg-blue-100 dark:bg-blue-900' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => handleSelectQAPair(qaPair)}
                  >
                    <p className="text-zinc-700 dark:text-zinc-300">
                      Q: {qaPair.question}
                    </p>
                    {qaPair.variants.map(v => (
                      <p key={v.id} className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                        Variant: {knowledgeBase.variantTypes.find(vt => vt.id === v.typeId)?.name}: {v.value}
                      </p>
                    ))}
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
          {selectedQAPair ? (
            <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Edit Q&A Pair</h4>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={deleteQAPair}
                  className="flex items-center"
                >
                  <HiTrash className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="question" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Question
                  </label>
                  <Input
                    id="question"
                    value={editingQAPair?.question ?? selectedQAPair.question}
                    onChange={(e) => setEditingQAPair({ ...editingQAPair!, question: e.target.value, variants: editingQAPair!.variants })}
                    onFocus={() => {
                      if (!editingQAPair) {
                        setEditingQAPair({ ...selectedQAPair });
                      }
                      if (selectedQAPair.question === 'New Question') {
                        setEditingQAPair({ ...selectedQAPair, question: '' });
                      }
                    }}
                    onBlur={() => {
                      if (editingQAPair) {
                        const sectionId = sections.find(s => s.qaPairs.includes(selectedQAPair))!.id;
                        const index = sections.find(s => s.qaPairs.includes(selectedQAPair))!.qaPairs.indexOf(selectedQAPair);
                        updateQAPair(sectionId, index, editingQAPair);
                      }
                    }}
                    className="w-full text-zinc-900 dark:text-zinc-100"
                    placeholder="Enter question"
                  />
                </div>
                <div>
                  <label htmlFor="answer" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Default Answer
                  </label>
                  <Textarea
                    id="answer"
                    value={editingQAPair?.answer ?? selectedQAPair.answer}
                    onChange={(e) => setEditingQAPair({ ...editingQAPair!, answer: e.target.value, variants: editingQAPair!.variants })}
                    onFocus={() => !editingQAPair && setEditingQAPair(selectedQAPair)}
                    onBlur={() => {
                      if (editingQAPair) {
                        const sectionId = sections.find(s => s.qaPairs.includes(selectedQAPair))!.id;
                        const index = sections.find(s => s.qaPairs.includes(selectedQAPair))!.qaPairs.indexOf(selectedQAPair);
                        updateQAPair(sectionId, index, editingQAPair);
                      }
                    }}
                    className="w-full text-zinc-900 dark:text-zinc-100"
                    placeholder="Enter default answer"
                    rows={5}
                  />
                </div>
                <div>
                  <h5 className="text-md font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Variants</h5>
                  {knowledgeBase.variantTypes.map((variantType) => (
                    <div key={variantType.id} className="mb-4">
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        {variantType.name}
                      </label>
                      <select
                        value={selectedQAPair?.variants.find(v => v.typeId === variantType.id)?.value || ''}
                        onChange={(e) => {
                          if (!selectedQAPair) return;
                          const updatedVariants = selectedQAPair.variants.filter(v => v.typeId !== variantType.id);
                          if (e.target.value) {
                            updatedVariants.push({
                              id: Date.now().toString(),
                              typeId: variantType.id,
                              value: e.target.value,
                              answer: ''
                            });
                          }
                          updateQAPair(
                            sections.find(s => s.qaPairs.includes(selectedQAPair))!.id,
                            sections.find(s => s.qaPairs.includes(selectedQAPair))!.qaPairs.indexOf(selectedQAPair),
                            { ...selectedQAPair, variants: updatedVariants }
                          );
                        }}
                        className="w-full p-2 border rounded text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-800"
                      >
                        <option value="">Select {variantType.name}</option>
                        {variantType.options.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                  {selectedQAPair?.variants.map((variant) => (
                    <div key={variant.id} className="mb-4 p-4 border rounded">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-medium text-zinc-700 dark:text-zinc-300">
                          {knowledgeBase.variantTypes.find(vt => vt.id === variant.typeId)?.name}: {variant.value}
                        </p>
                        <div>
                          <Switch
                            checked={variant.active || false}
                            onCheckedChange={() => toggleVariantActive(variant.id)}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeVariant(variant.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                      <Textarea
                        value={variant.answer}
                        onChange={(e) => updateVariant(variant.id, { answer: e.target.value })}
                        className="w-full"
                        placeholder="Enter variant answer"
                        rows={3}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-800 p-4 rounded-lg shadow">
              Select a Q&A pair to edit
            </div>
          )}
        </div>
      </div>
      <Button onClick={() => updateKnowledgeBase({ ...knowledgeBase })} className="mt-4">Save Changes</Button>
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
    variantTypes: [],
  });
  const [isRagManagerOpen, setIsRagManagerOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

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
      variantTypes: [],
    });
  };

  const handleNextStep = () => {
    setWizardStep(Math.min(wizardStep + 1, 3));
  };

  const handlePreviousStep = () => {
    setWizardStep(wizardStep - 1);
  };

  const handleCreateKnowledgeBase = () => {
    // Add logic to create the knowledge base
    setKnowledgeBase(newKnowledgeBase);
    setShowConfetti(true);
    setIsFadingOut(true);
    setTimeout(() => {
      closeWizard();
      setIsFadingOut(false);
      setShowConfetti(false);
    }, 3000); // Adjust this time as needed
  };

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 5000); // Stop confetti after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

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
          {knowledgeBase && (
            <RagManager 
              knowledgeBase={knowledgeBase} 
              updateKnowledgeBase={setKnowledgeBase}
            />
          )}
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
        <DialogContent className={`transition-opacity duration-1000 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>
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
              <h4 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Define Variant Types</h4>
              {newKnowledgeBase.variantTypes.map((variantType, index) => (
                <Card key={variantType.id} className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <Input
                      value={variantType.name}
                      onChange={(e) => {
                        const updatedVariantTypes = [...newKnowledgeBase.variantTypes];
                        updatedVariantTypes[index].name = e.target.value;
                        setNewKnowledgeBase({...newKnowledgeBase, variantTypes: updatedVariantTypes});
                      }}
                      className="w-1/3 mr-2"
                      placeholder="Variant type name"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const updatedVariantTypes = newKnowledgeBase.variantTypes.filter((_, i) => i !== index);
                        setNewKnowledgeBase({...newKnowledgeBase, variantTypes: updatedVariantTypes});
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {variantType.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center">
                        <Input
                          value={option}
                          onChange={(e) => {
                            const updatedVariantTypes = [...newKnowledgeBase.variantTypes];
                            updatedVariantTypes[index].options[optionIndex] = e.target.value;
                            setNewKnowledgeBase({...newKnowledgeBase, variantTypes: updatedVariantTypes});
                          }}
                          className="w-full mr-2"
                          placeholder="Option"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const updatedVariantTypes = [...newKnowledgeBase.variantTypes];
                            updatedVariantTypes[index].options = updatedVariantTypes[index].options.filter((_, i) => i !== optionIndex);
                            setNewKnowledgeBase({...newKnowledgeBase, variantTypes: updatedVariantTypes});
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const updatedVariantTypes = [...newKnowledgeBase.variantTypes];
                        updatedVariantTypes[index].options.push('');
                        setNewKnowledgeBase({...newKnowledgeBase, variantTypes: updatedVariantTypes});
                      }}
                    >
                      Add Option
                    </Button>
                  </div>
                </Card>
              ))}
              <Button
                variant="outline"
                onClick={() => {
                  const newVariantType = {
                    id: Date.now().toString(),
                    name: '',
                    options: ['']
                  };
                  setNewKnowledgeBase({...newKnowledgeBase, variantTypes: [...newKnowledgeBase.variantTypes, newVariantType]});
                }}
              >
                Add Variant Type
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
      {showConfetti && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <Confetti />
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-2">Knowledge Base Added!</h2>
            <p>Your new knowledge base is ready to use.</p>
          </div>
        </div>
      )}
    </div>
  );
}